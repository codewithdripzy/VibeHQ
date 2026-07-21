import { v4 as uuidv4 } from "uuid";
import { BrainstormSession } from "../models/brainstormSession.model";
import { chat } from "../llm/router";
import type { LLMMessage } from "../llm/provider";
import { toolRegistry, ToolResult } from "../tools/registry";
import { Company } from "../models/company.model";
import { Team } from "../models/team.model";
import { Agent } from "../models/agent.model";
import { Project } from "../models/project.model";
import { cache } from "./cache.service";
import fs from "fs";
import path from "path";

const PROMPTS_DIR = path.resolve(__dirname, "../data/prompts");

const phaseLabels: Record<number, string> = {
    1: "Problem Discovery",
    2: "Solution Exploration",
    3: "Board Decision",
    4: "Feasibility Check",
    5: "Synthesis",
    6: "Complete",
};

interface BrainstormQuestion {
    id: string;
    parentId?: string;
    phase: number;
    depth: number;
    question: string;
    status: "pending" | "researching" | "resolved" | "delegated" | "skipped";
    answer?: string;
    confidence: number;
    searchQueries: string[];
    sources: { title: string; url: string; snippet: string }[];
    delegation?: {
        to: string;
        from: string;
        context: string;
        researchDone: string;
        specificQuestion: string;
        deadline: Date;
        status: "pending" | "in_progress" | "completed" | "timeout";
        response?: string;
    };
    createdAt: Date;
    resolvedAt?: Date;
}

interface BrainstormConfig {
    companyId: string;
    userId: string;
    trigger?: "manual" | "auto" | "scheduled";
    maxDepth?: number;
    maxTurns?: number;
    timeLimitMinutes?: number; // default: 1440 (24 hours)
}

class BrainstormService {
    private static instance: BrainstormService;
    static getInstance(): BrainstormService {
        if (!BrainstormService.instance) {
            BrainstormService.instance = new BrainstormService();
        }
        return BrainstormService.instance;
    }

    async startSession(config: BrainstormConfig) {
        const company = await Company.findById(config.companyId);
        if (!company) throw new Error("Company not found");

        const sessionId = uuidv4();
        // Default 24h time limit — sessions should survive server restarts
        const expiresAt = new Date();
        const minutes = config.timeLimitMinutes || 1440; // 24 hours default
        expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

        const session = await BrainstormSession.create({
            uid: sessionId,
            company: config.companyId,
            status: "running",
            phase: 1,
            trigger: config.trigger || "manual",
            initiatedBy: config.userId,
            maxDepth: config.maxDepth || 5,
            maxTurns: config.maxTurns || 30,
            timeLimitMinutes: config.timeLimitMinutes || 10,
            expiresAt,
            questions: [],
        });

        // Start the brainstorm loop asynchronously
        this.runBrainstormLoop(session._id.toString()).catch((err) => {
            console.error(`Brainstorm session ${sessionId} failed:`, err);
            BrainstormSession.findByIdAndUpdate(session._id, { status: "failed" });
        });

        return session;
    }

    async getSession(sessionId: string) {
        return BrainstormSession.findOne({ uid: sessionId });
    }

    async getCompanySessions(companyId: string, limit = 20) {
        return BrainstormSession.find({ company: companyId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async pauseSession(sessionId: string) {
        return BrainstormSession.findOneAndUpdate(
            { uid: sessionId },
            { status: "paused" },
            { new: true }
        );
    }

    async resumeSession(sessionId: string) {
        const session = await BrainstormSession.findOneAndUpdate(
            { uid: sessionId, status: "paused" },
            { status: "running" },
            { new: true }
        );
        if (session) {
            this.runBrainstormLoop(session._id.toString()).catch(console.error);
        }
        return session;
    }

    async cancelSession(sessionId: string) {
        return BrainstormSession.findOneAndUpdate(
            { uid: sessionId },
            { status: "cancelled", completedAt: new Date() },
            { new: true }
        );
    }

    private async runBrainstormLoop(sessionId: string) {
        const session = await BrainstormSession.findById(sessionId);
        if (!session || session.status !== "running") return;

        const company = await Company.findById(session.company);
        if (!company) return;

        const prompt = this.loadPrompt("brainstorm.txt");
        const commPrompt = this.loadPrompt("communication.txt");
        const basePrompt = this.loadPrompt("base.txt");

        // Load existing teams for delegation context
        const existingTeams = await this.loadExistingTeams(session.company.toString());

        // Load existing projects to avoid duplicates
        const existingProjects = await this.loadExistingProjects(session.company.toString());

        const systemPrompt = this.buildSystemPrompt(
            prompt,
            commPrompt,
            basePrompt,
            company,
            session,
            existingTeams,
            existingProjects
        );

        const messages: LLMMessage[] = [
            { role: "system", content: systemPrompt },
        ];

        // Seed the initial question if empty
        if (session.questions.length === 0) {
            const rootQuestion: BrainstormQuestion = {
                id: uuidv4(),
                phase: 1,
                depth: 0,
                question: `What problem does ${company.name} solve in the ${company.industry || "technology"} industry, and what should we build?`,
                status: "pending",
                confidence: 0,
                searchQueries: [],
                sources: [],
                createdAt: new Date(),
            };
            session.questions.push(rootQuestion as any);
            session.currentQuestionId = rootQuestion.id;

            // Add opening chat message
            (session as any).chatLog = (session as any).chatLog || [];
            (session as any).chatLog.push({
                team: "board",
                sender: "System",
                content: `Board meeting started for ${company.name}. Initiating brainstorm session to explore strategy and opportunities.`,
                type: "system",
                timestamp: new Date(),
            });
            (session as any).chatLog.push({
                team: "board",
                sender: "CEO",
                content: `Let's begin by understanding the problem space. "${rootQuestion.question}"`,
                type: "message",
                timestamp: new Date(),
            });

            await session.save();
        }

        let turns = session.turnsUsed || 0;
        const maxTurns = session.maxTurns || 30;
        const agents = ["CEO", "CTO", "CMO", "CFO", "COO"];
        const searchedQueries = new Set<string>(); // Track search queries to prevent loops

        while (turns < maxTurns) {
            const currentSession = await BrainstormSession.findById(sessionId);
            if (!currentSession || currentSession.status !== "running") break;

            // Check time limit
            if (currentSession.expiresAt && new Date() > currentSession.expiresAt) {
                await this.completeSession(sessionId, "time_limit");
                break;
            }

            turns++;
            currentSession.turnsUsed = turns;

            // Pick 2-3 agents to respond in parallel for natural conversation
            const numAgents = 2 + Math.floor(Math.random() * 2); // 2 or 3
            const shuffled = [...agents].sort(() => Math.random() - 0.5);
            const activeAgents = shuffled.slice(0, numAgents);

            // Clean up any orphaned typing indicators from previous failed turns
            const logForCleanup = (currentSession as any).chatLog;
            for (let i = logForCleanup.length - 1; i >= 0; i--) {
                if (logForCleanup[i].type === "typing" && logForCleanup[i].typing === true) {
                    logForCleanup.splice(i, 1);
                }
            }

            // Push typing indicators for all active agents
            for (const agent of activeAgents) {
                (currentSession as any).chatLog.push({
                    team: "board",
                    sender: agent,
                    content: `${agent} is thinking...`,
                    type: "typing",
                    typing: true,
                    timestamp: new Date(),
                });
            }
            await currentSession.save();

            // Helper to remove typing indicator
            const removeTyping = async (session: any, agent: string) => {
                const log = (session as any).chatLog;
                const idx = log.findIndex((m: any) => m.type === "typing" && m.sender === agent && m.typing === true);
                if (idx !== -1) log.splice(idx, 1);
                await session.save().catch(() => {});
            };

            // Inject full conversation context
            const conversationSummary = this.buildConversationSummary(currentSession);

            // Run all agents in parallel
            const LLM_TIMEOUT = 60000;
            try {
                const agentPromises = activeAgents.map(async (agent) => {
                const agentContext = `\n\n--- AGENT CONTEXT ---\nYou are acting as: ${agent}\nFull conversation across all teams:\n${conversationSummary}\n--- END CONTEXT ---`;

                const agentMessages = [...messages];
                // Limit context window — keep system prompt + last 10 messages to avoid overwhelming small models
                if (agentMessages.length > 12) {
                    const systemMsg = agentMessages[0]; // Keep system prompt
                    const recentMsgs = agentMessages.slice(-10);
                    agentMessages.length = 0;
                    agentMessages.push(systemMsg, ...recentMsgs);
                }
                if (agentMessages.length > 0) {
                    const lastMsg = agentMessages[agentMessages.length - 1];
                    if (lastMsg.role === "user") {
                        agentMessages[agentMessages.length - 1] = {
                            ...lastMsg,
                            content: lastMsg.content + agentContext,
                        };
                    } else {
                        agentMessages.push({ role: "user", content: `Current state:${agentContext}` });
                    }
                }

                try {
                    console.log(`[Brainstorm] Turn ${turns}: ${agent} calling LLM...`);
                    const response = await Promise.race([
                        chat(agentMessages, session.company.toString()),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error("LLM call timed out")), LLM_TIMEOUT)
                        ),
                    ]);
                    console.log(`[Brainstorm] Turn ${turns}: ${agent} responded (${response.content.length} chars)`);
                    return { agent, response: response.content, error: null };
                } catch (error: any) {
                    console.error(`[Brainstorm] Turn ${turns}: ${agent} failed:`, error.message);
                    return { agent, response: null, error: error.message };
                }
            });

            const results = await Promise.allSettled(agentPromises);

            // Process all responses
            for (const result of results) {
                const data = result.status === "fulfilled" ? result.value : null;
                if (!data) continue;

                // Remove typing indicator
                await removeTyping(currentSession, data.agent);

                if (data.error || !data.response) continue;

                messages.push({ role: "assistant", content: data.response });

                // Parse response
                const parsed = this.parseResponse(data.response);

                // Add conversation messages to chat log
                for (const msg of parsed.conversation) {
                    (currentSession as any).chatLog.push({
                        team: "board",
                        sender: msg.agent,
                        content: msg.message,
                        type: "message",
                        timestamp: new Date(),
                    });
                }

                // Process actions
                for (const action of parsed.actions) {
                    if (action.type === "search") {
                        // Skip duplicate searches
                        const queryKey = action.query.toLowerCase().trim();
                        if (searchedQueries.has(queryKey)) {
                            console.log(`[Brainstorm] Skipping duplicate search: "${action.query}"`);
                            continue;
                        }
                        searchedQueries.add(queryKey);

                        const searchResult = await this.executeSearch(
                            action.query,
                            session.company.toString()
                        );
                        messages.push({
                            role: "user",
                            content: `Search results for "${action.query}":\n${JSON.stringify(searchResult, null, 2)}`,
                        });

                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: data.agent,
                            content: `🔍 Researching: "${action.query}"`,
                            type: "message",
                            timestamp: new Date(),
                        });

                        if (currentSession.currentQuestionId) {
                            const q = currentSession.questions.find(
                                (q: any) => q.id === currentSession.currentQuestionId
                            );
                            if (q) {
                                q.searchQueries.push(action.query);
                                if (searchResult.success && searchResult.data?.results) {
                                    q.sources.push(
                                        ...searchResult.data.results.slice(0, 3).map((r: any) => ({
                                            title: r.title,
                                            url: r.url,
                                            snippet: r.description,
                                        }))
                                    );
                                }
                            }
                        }
                    }

                    if (action.type === "delegate") {
                        const delegationObj = {
                            to: action.to,
                            question: action.question,
                            context: action.context || "",
                            status: "pending" as const,
                            createdAt: new Date(),
                        };
                        currentSession.delegations.push(delegationObj as any);

                        const docDraft = action.documentDraft;
                        let delegationContent = `**Requesting information from ${action.to}**\n\n`;
                        delegationContent += `**Question:** ${action.question}\n`;
                        if (docDraft) {
                            delegationContent += `\n---\n`;
                            delegationContent += `## ${docDraft.title || "Delegation Request"}\n\n`;
                            delegationContent += `**Summary:** ${docDraft.summary || ""}\n\n`;
                            delegationContent += `### General Context (applies to all teams)\n${docDraft.generalContext || action.context || ""}\n\n`;
                            delegationContent += `### Specific Request for ${action.to}\n${docDraft.specificRequest || action.question}\n\n`;
                            if (docDraft.deliverables?.length) {
                                delegationContent += `### Deliverables\n${docDraft.deliverables.map((d: string) => `- ${d}`).join("\n")}\n\n`;
                            }
                            if (docDraft.evaluationCriteria) {
                                delegationContent += `### Evaluation Criteria\n${docDraft.evaluationCriteria}\n`;
                            }
                            delegationContent += `---\n`;
                        } else {
                            delegationContent += `**Context:** ${action.context || "N/A"}\n`;
                        }
                        if (action.deadline) {
                            delegationContent += `\n**Deadline:** ${action.deadline}`;
                        }

                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: data.agent,
                            content: delegationContent,
                            type: "delegation",
                            linkedDelegationTo: action.to,
                            timestamp: new Date(),
                        });
                        (currentSession as any).chatLog.push({
                            team: action.to,
                            sender: "System",
                            content: `📋 **New delegation received from Board**\n\n${delegationContent}`,
                            type: "system",
                            timestamp: new Date(),
                        });

                        if (currentSession.currentQuestionId) {
                            const q = currentSession.questions.find(
                                (q: any) => q.id === currentSession.currentQuestionId
                            );
                            if (q) {
                                q.status = "delegated";
                                q.delegation = {
                                    to: action.to,
                                    from: "Board",
                                    context: action.context || "",
                                    researchDone: "",
                                    specificQuestion: action.question,
                                    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours max
                                    status: "pending",
                                };
                            }
                        }

                        // Auto-generate team response
                        try {
                            await this.generateTeamResponse(
                                currentSession,
                                delegationObj,
                                session.company.toString(),
                                messages,
                                systemPrompt
                            );
                        } catch (err: any) {
                            console.error(`[Brainstorm] Auto team response failed:`, err.message);
                        }
                    }

                    if (action.type === "delegate_response") {
                        const delegation = currentSession.delegations.find(
                            (d: any) => d.to === action.to && d.status !== "completed"
                        );
                        if (delegation) {
                            delegation.status = "completed";
                            delegation.response = action.answer;
                            delegation.completedAt = new Date();
                            delegation.resources = action.resources || [];
                        }

                        let responseContent = action.answer || "";
                        if (action.resources?.length) {
                            responseContent += "\n\n---\n**Attached Resources:**\n";
                            const icons: Record<string, string> = { document: "📄", file: "📁", image: "🖼️", link: "🔗", code: "💻", data: "📊" };
                            for (const res of action.resources) {
                                const icon = icons[res.type] || "📎";
                                responseContent += `${icon} **${res.name}** (${res.type})\n`;
                                if (res.url) responseContent += `  URL: ${res.url}\n`;
                                if (res.content && res.type !== "document") {
                                    const preview = res.content.length > 200 ? res.content.slice(0, 200) + "..." : res.content;
                                    responseContent += `  Preview: ${preview}\n`;
                                }
                            }
                        }

                        (currentSession as any).chatLog.push({
                            team: action.to,
                            sender: action.to.charAt(0).toUpperCase() + action.to.slice(1),
                            content: responseContent,
                            type: "response",
                            resources: action.resources || [],
                            timestamp: new Date(),
                        });

                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: "System",
                            content: `📥 Response received from ${action.to} — ${action.resources?.length || 0} resource(s) attached`,
                            type: "system",
                            timestamp: new Date(),
                        });
                    }

                    if (action.type === "answer") {
                        if (currentSession.currentQuestionId) {
                            const q = currentSession.questions.find(
                                (q: any) => q.id === currentSession.currentQuestionId
                            );
                            if (q) {
                                q.answer = action.answer;
                                q.confidence = action.confidence || 70;
                                q.status = q.confidence >= 70 ? "resolved" : "pending";
                                q.resolvedAt = q.confidence >= 70 ? new Date() : undefined;

                                (currentSession as any).chatLog.push({
                                    team: "board",
                                    sender: data.agent,
                                    content: action.answer,
                                    type: "message",
                                    timestamp: new Date(),
                                });
                            }
                        }
                    }

                    if (action.type === "new_question") {
                        const newQ: BrainstormQuestion = {
                            id: uuidv4(),
                            parentId: currentSession.currentQuestionId || undefined,
                            phase: action.phase || currentSession.phase,
                            depth: (action.depth || 0) + 1,
                            question: action.question,
                            status: "pending",
                            confidence: 0,
                            searchQueries: [],
                            sources: [],
                            createdAt: new Date(),
                        };
                        currentSession.questions.push(newQ as any);

                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: data.agent,
                            content: `💭 New question: "${action.question}"`,
                            type: "message",
                            timestamp: new Date(),
                        });
                    }

                    if (action.type === "next_question") {
                        const nextQ = currentSession.questions.find(
                            (q: any) => q.status === "pending"
                        );
                        if (nextQ) {
                            currentSession.currentQuestionId = nextQ.id;
                        }
                    }

                    if (action.type === "phase_advance") {
                        currentSession.phase = Math.min(action.phase || currentSession.phase + 1, 6);
                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: "System",
                            content: `Advancing to phase ${currentSession.phase}: ${phaseLabels[currentSession.phase] || "Unknown"}`,
                            type: "system",
                            timestamp: new Date(),
                        });
                    }

                    if (action.type === "synthesis") {
                        currentSession.summary = {
                            problemStatement: action.problemStatement || "",
                            proposedSolution: action.proposedSolution || "",
                            targetMarket: action.targetMarket || "",
                            businessModel: action.businessModel || "",
                            competitiveAdvantage: action.competitiveAdvantage || "",
                            mvpScope: action.mvpScope || "",
                            resourceRequirements: action.resourceRequirements || "",
                            riskAssessment: action.riskAssessment || "",
                            recommendation: action.recommendation || "iterate",
                            nextSteps: action.nextSteps || [],
                        };

                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: data.agent,
                            content: `📊 Synthesis complete. Recommendation: ${action.recommendation || "iterate"}. ${action.problemStatement || ""}`,
                            type: "message",
                            timestamp: new Date(),
                        });
                    }

                    if (action.type === "assemble_team") {
                        try {
                            const result = await this.assembleTeam(
                                session.company.toString(),
                                action
                            );
                            (currentSession as any).chatLog.push({
                                team: "board",
                                sender: "System",
                                content: `✅ **Team "${action.teamName}" created** (${action.department})\nRoles: ${action.roles?.map((r: any) => r.name).join(", ") || "Unspecified"}\nYou can now delegate work to this team.`,
                                type: "system",
                                timestamp: new Date(),
                            });
                        } catch (err: any) {
                            (currentSession as any).chatLog.push({
                                team: "board",
                                sender: "System",
                                content: `❌ Failed to create team "${action.teamName}": ${err.message}`,
                                type: "system",
                                timestamp: new Date(),
                            });
                        }
                    }

                    if (action.type === "complete") {
                        await this.completeSession(sessionId, "completed");
                        return;
                    }
                }
            }

            await currentSession.save();

            // Cache conversation state in Redis (survives server restarts)
            const cacheKey = `brainstorm:${session.company}:${session.uid}`;
            await cache.set(cacheKey, {
                sessionId: session.uid,
                companyId: session.company.toString(),
                messages: messages.slice(-20),
                chatLog: (currentSession as any).chatLog,
                phase: currentSession.phase,
                turnsUsed: currentSession.turnsUsed,
                questions: currentSession.questions,
                delegations: currentSession.delegations,
                summary: currentSession.summary,
                lastUpdated: new Date().toISOString(),
            }, 86400);

            // Save to company context history
            const historyKey = `company:${session.company}:context_history`;
            const existingHistory = await cache.get<any[]>(historyKey) || [];
            existingHistory.push({
                sessionId: session.uid,
                timestamp: new Date().toISOString(),
                phase: currentSession.phase,
                agent: activeAgents.join(", "),
                summary: this.buildStateSummary(currentSession),
            });
            if (existingHistory.length > 50) existingHistory.splice(0, existingHistory.length - 50);
            await cache.set(historyKey, existingHistory, 604800);

            // Build next prompt with current state
            const stateSummary = this.buildStateSummary(currentSession);
            messages.push({
                role: "user",
                content: `Current brainstorm state:\n${stateSummary}\n\nContinue the brainstorm. What should we explore next? Use search when you need data. Delegate when you need specialized knowledge. Synthesize when you have enough.`,
            });
        } catch (error: any) {
            console.error(`Brainstorm turn ${turns} failed:`, error.message);
            // Remove all typing indicators on error
            for (const agent of activeAgents) {
                await removeTyping(currentSession, agent);
            }
            // Don't break — try next turn
        }
        }

        // If we exhausted turns, complete with what we have
        const finalSession = await BrainstormSession.findById(sessionId);
        if (finalSession && finalSession.status === "running") {
            await this.completeSession(sessionId, "turn_limit");
        }
    }

    private buildSystemPrompt(
        brainstormPrompt: string,
        commPrompt: string,
        basePrompt: string,
        company: any,
        session: any,
        existingTeams?: string,
        existingProjects?: string
    ): string {
        let prompt = brainstormPrompt;

        // Interpolate variables
        prompt = prompt.replace(/\{\{company_name\}\}/g, company.name || "Unknown");
        prompt = prompt.replace(/\{\{company_industry\}\}/g, company.industry || "technology");
        prompt = prompt.replace(/\{\{company_description\}\}/g, company.description || "");
        prompt = prompt.replace(/\{\{company_mission\}\}/g, company.mission || "Not yet defined");
        prompt = prompt.replace(/\{\{company_vision\}\}/g, company.vision || "Not yet defined");
        prompt = prompt.replace(/\{\{company_values\}\}/g, (company.values || []).join(", ") || "Not yet defined");
        prompt = prompt.replace(/\{\{existing_teams\}\}/g, existingTeams || "No teams exist yet.");
        prompt = prompt.replace(/\{\{existing_projects\}\}/g, existingProjects || "No projects exist yet.");

        const now = new Date();
        prompt = prompt.replace(/\{\{currentYear\}\}/g, String(now.getFullYear()));
        prompt = prompt.replace(/\{\{currentDate\}\}/g, now.toISOString().split("T")[0]);
        prompt = prompt.replace(/\{\{currentDay\}\}/g, now.toLocaleDateString("en-US", { weekday: "long" }));

        prompt = prompt.replace(/\{\{session_id\}\}/g, session.uid);
        prompt = prompt.replace(/\{\{max_depth\}\}/g, String(session.maxDepth || 5));
        prompt = prompt.replace(/\{\{max_turns\}\}/g, String(session.maxTurns || 30));
        prompt = prompt.replace(/\{\{time_limit_minutes\}\}/g, String(session.timeLimitMinutes || 10));

        prompt += "\n\n--- COMMUNICATION HIERARCHY ---\n" + commPrompt;

        prompt += `\n\n--- CURRENT DATE & TIME ---\n${now.toISOString()}\nDay: ${now.toLocaleDateString("en-US", { weekday: "long" })}\nDate: ${now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\nTime: ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}\nUse this as the current date for any market research, trends, or time-sensitive analysis.`;

        return prompt;
    }

    private buildStateSummary(session: any): string {
        const lines: string[] = [];
        lines.push(`Phase: ${session.phase}/6`);
        lines.push(`Turns used: ${session.turnsUsed}/${session.maxTurns}`);
        lines.push(`Questions: ${session.questions.length} total`);

        const resolved = session.questions.filter((q: any) => q.status === "resolved").length;
        const pending = session.questions.filter((q: any) => q.status === "pending").length;
        const delegated = session.questions.filter((q: any) => q.status === "delegated").length;

        lines.push(`  Resolved: ${resolved}, Pending: ${pending}, Delegated: ${delegated}`);

        if (session.currentQuestionId) {
            const current = session.questions.find((q: any) => q.id === session.currentQuestionId);
            if (current) {
                lines.push(`Current question: "${current.question}" (depth ${current.depth})`);
            }
        }

        if (session.delegations.length > 0) {
            lines.push(`Active delegations: ${session.delegations.length}`);
        }

        return lines.join("\n");
    }

    private buildConversationSummary(session: any): string {
        const lines: string[] = [];
        const chatLog = (session as any).chatLog || [];

        // Group messages by team
        const teamMessages: Record<string, any[]> = {};
        for (const msg of chatLog) {
            if (!teamMessages[msg.team]) teamMessages[msg.team] = [];
            teamMessages[msg.team].push(msg);
        }

        // Show recent messages from each team (last 5 per team)
        for (const [team, msgs] of Object.entries(teamMessages)) {
            const recent = msgs.slice(-5);
            lines.push(`\n[${team.toUpperCase()}]`);
            for (const msg of recent) {
                const prefix = msg.type === "delegation" ? "DELEGATION:" :
                              msg.type === "response" ? "RESPONSE:" :
                              msg.type === "system" ? "SYSTEM:" : "";
                const preview = msg.content.length > 200 ? msg.content.slice(0, 200) + "..." : msg.content;
                lines.push(`  ${prefix} ${msg.sender}: ${preview}`);
            }
        }

        // Show delegations summary
        if (session.delegations?.length) {
            lines.push(`\n[DELEGATIONS]`);
            for (const d of session.delegations) {
                lines.push(`  ${d.to}: ${d.status} - ${d.question?.slice(0, 100)}`);
            }
        }

        return lines.join("\n");
    }

    private parseBrainstormResponse(response: string): any[] {
        // Try to parse as JSON first
        try {
            // Extract JSON from response (LLM might wrap it in markdown code blocks)
            const jsonMatch = response.match(/```json\s*([\s\S]+?)\s*```/) || response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return [{ type: "answer", answer: response.trim(), confidence: 50 }];
            }

            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsed = JSON.parse(jsonStr);

            if (parsed.actions && Array.isArray(parsed.actions)) {
                return parsed.actions;
            }

            // If it's a single action object (no actions array)
            if (parsed.type) {
                return [parsed];
            }

            return [{ type: "answer", answer: response.trim(), confidence: 50 }];
        } catch {
            // If JSON parsing fails, treat entire response as answer
            return [{ type: "answer", answer: response.trim(), confidence: 50 }];
        }
    }

    private parseResponse(response: string): { conversation: { agent: string; message: string }[]; actions: any[] } {
        try {
            // Try to find the JSON object by matching braces properly
            let jsonStr = "";

            // First try markdown code block
            const codeBlockMatch = response.match(/```json\s*([\s\S]+?)\s*```/);
            if (codeBlockMatch) {
                jsonStr = codeBlockMatch[1];
            } else {
                // Find the first { and match to its closing }
                const firstBrace = response.indexOf("{");
                if (firstBrace !== -1) {
                    let depth = 0;
                    let end = firstBrace;
                    for (let i = firstBrace; i < response.length; i++) {
                        if (response[i] === "{") depth++;
                        if (response[i] === "}") depth--;
                        if (depth === 0) { end = i + 1; break; }
                    }
                    jsonStr = response.substring(firstBrace, end);
                }
            }

            if (!jsonStr) {
                // No JSON found — treat as plain text from the responding agent
                return {
                    conversation: [{ agent: "Board", message: response.trim() }],
                    actions: [],
                };
            }

            const parsed = JSON.parse(jsonStr);

            // Handle conversation format
            if (parsed.conversation && Array.isArray(parsed.conversation)) {
                return {
                    conversation: parsed.conversation.map((c: any) => ({
                        agent: c.agent || c.sender || "Board",
                        message: c.message || c.content || "",
                    })).filter((c: any) => c.message),
                    actions: parsed.actions || [],
                };
            }

            // Handle legacy thought format
            if (parsed.thought) {
                return {
                    conversation: [{ agent: parsed.agent || "Board", message: parsed.thought }],
                    actions: parsed.actions || [],
                };
            }

            // Fallback
            const message = parsed.message || parsed.content || parsed.answer || "";
            return {
                conversation: message ? [{ agent: parsed.agent || "Board", message }] : [],
                actions: parsed.actions || (parsed.type ? [parsed] : []),
            };
        } catch {
            // JSON parse failed — don't show raw JSON, just skip
            return { conversation: [], actions: [] };
        }
    }

    private async executeSearch(query: string, companyId: string): Promise<ToolResult> {
        try {
            const context = {
                companyId,
                agentId: "brainstorm",
                agentRole: "ceo",
            };
            return await toolRegistry.execute("web_search", { query, count: 5 }, context);
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    private async loadExistingTeams(companyId: string): Promise<string> {
        try {
            const teams = await Team.find({ company: companyId, deletedAt: null }).lean();
            if (!teams.length) {
                return "No teams exist yet. The board should discuss hiring/creating teams before delegating work.";
            }

            const lines: string[] = [];
            for (const team of teams) {
                const agentCount = await Agent.countDocuments({ company: companyId, team: team._id, deletedAt: null });
                lines.push(`- **${team.name}** (${team.department}) — ${agentCount} agent(s) — ${team.description || "No description"}`);
            }
            return "EXISTING TEAMS:\n" + lines.join("\n");
        } catch (err: any) {
            console.error(`[Brainstorm] Failed to load existing teams:`, err.message);
            return "No teams exist yet. The board should discuss hiring/creating teams before delegating work.";
        }
    }

    private async loadExistingProjects(companyId: string): Promise<string> {
        try {
            const projects = await Project.find({ company: companyId, deletedAt: null })
                .select("name description status priority tags")
                .lean();
            if (!projects.length) {
                return "No projects exist yet. The board should define what to build.";
            }

            const lines: string[] = [];
            for (const p of projects) {
                const statusEmoji: Record<string, string> = {
                    planning: "📝", active: "🟢", on_hold: "⏸️", completed: "✅", cancelled: "❌",
                };
                const emoji = statusEmoji[p.status] || "📋";
                lines.push(`- ${emoji} **${p.name}** (${p.status}/${p.priority}) — ${p.description?.slice(0, 120) || "No description"}`);
            }
            return "EXISTING PROJECTS — DO NOT CREATE DUPLICATES:\n" + lines.join("\n") + "\n\nThe board should explore ways to expand or build an ecosystem around these existing projects rather than creating overlapping ones.";
        } catch (err: any) {
            console.error(`[Brainstorm] Failed to load existing projects:`, err.message);
            return "No projects exist yet.";
        }
    }

    private async generateTeamResponse(
        session: any,
        delegation: any,
        companyId: string,
        messages: LLMMessage[],
        systemPrompt: string
    ): Promise<void> {
        const teamName = delegation.to;
        const question = delegation.question;
        const teamRoles = ["Team Lead", "Researcher", "Analyst"];

        // Push typing indicators for team members
        const activeRoles = teamRoles.slice(0, 2 + Math.floor(Math.random() * 2)); // 2-3 members
        for (const role of activeRoles) {
            (session as any).chatLog.push({
                team: teamName,
                sender: role,
                content: `${role} is working on: ${question.slice(0, 60)}...`,
                type: "typing",
                typing: true,
                timestamp: new Date(),
            });
        }
        await session.save();

        const teamPrompt = `You are a member of the ${teamName} team. The board has delegated a task to your team.

DELEGATION QUESTION: ${question}

CONTEXT: ${delegation.context || "N/A"}

Your team is having a discussion to research and answer this question. Multiple team members are contributing in parallel.

RULES:
1. Each team member should speak from their perspective (Team Lead coordinates, Researcher digs into data, Analyst synthesizes)
2. Build on what others said — this is a team discussion, not independent reports
3. Use search if you need data
4. Each member should contribute UNIQUE insights
5. After discussing, the Team Lead should synthesize the team's findings into a final response

RESPONSE FORMAT — respond with a JSON object:
{
  "conversation": [
    { "agent": "Team Lead", "message": "coordinate and direct the research" },
    { "agent": "Researcher", "message": "share findings from research" },
    { "agent": "Analyst", "message": "analyze data and provide insights" }
  ],
  "synthesis": "Team Lead's final synthesis of findings",
  "resources": [
    { "type": "document", "name": "Report", "content": "...", "mimeType": "text/markdown" }
  ]
}`;

        const teamMessages: LLMMessage[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: teamPrompt },
        ];

        try {
            const response = await Promise.race([
                chat(teamMessages, companyId),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error("Team LLM call timed out")), 60000)
                ),
            ]);

            // Remove all typing indicators for this team
            const log = (session as any).chatLog;
            for (const role of activeRoles) {
                const idx = log.findIndex((m: any) => m.type === "typing" && m.sender === role && m.typing === true);
                if (idx !== -1) log.splice(idx, 1);
            }

            // Parse the team response
            const parsed = this.parseTeamConversation(response.content);

            // Add team conversation to chat log
            for (const msg of parsed.conversation) {
                (session as any).chatLog.push({
                    team: teamName,
                    sender: msg.agent,
                    content: msg.message,
                    type: "message",
                    timestamp: new Date(),
                });
            }

            // Add synthesis as the final response
            const synthesis = parsed.synthesis || parsed.answer || response.content.slice(0, 500);
            if (parsed.conversation.length === 0) {
                // Fallback: add the raw response as a single message
                (session as any).chatLog.push({
                    team: teamName,
                    sender: "Team Lead",
                    content: synthesis,
                    type: "response",
                    resources: parsed.resources || [],
                    timestamp: new Date(),
                });
            } else {
                (session as any).chatLog.push({
                    team: teamName,
                    sender: "Team Lead",
                    content: `**Team Synthesis:** ${synthesis}`,
                    type: "response",
                    resources: parsed.resources || [],
                    timestamp: new Date(),
                });
            }

            // Update delegation status
            delegation.status = "completed";
            delegation.response = synthesis;
            delegation.completedAt = new Date();
            delegation.resources = parsed.resources || [];

            // Notify board
            let boardPreview = synthesis.length > 300 ? synthesis.slice(0, 300) + "..." : synthesis;
            (session as any).chatLog.push({
                team: "board",
                sender: "System",
                content: `📥 **Response from ${teamName}** — ${parsed.conversation.length} team member(s) discussed, ${parsed.resources?.length || 0} deliverable(s)\n\n${boardPreview}`,
                type: "system",
                timestamp: new Date(),
            });

            // Add response to LLM conversation for board context
            messages.push({
                role: "user",
                content: `Team response from ${teamName} (${parsed.conversation.length} members discussed): ${synthesis}`,
            });

            console.log(`[Brainstorm] Team "${teamName}" responded (${parsed.conversation.length} members, ${response.content.length} chars)`);
        } catch (error: any) {
            console.error(`[Brainstorm] Team "${teamName}" failed to respond:`, error.message);

            // Remove all typing indicators
            const log = (session as any).chatLog;
            for (const role of activeRoles) {
                const idx = log.findIndex((m: any) => m.type === "typing" && m.sender === role && m.typing === true);
                if (idx !== -1) log.splice(idx, 1);
            }

            // Mark delegation as failed
            delegation.status = "timeout";
            delegation.response = `Team failed to respond: ${error.message}`;

            // Trigger HR assessment for capacity issues
            (session as any).chatLog.push({
                team: "board",
                sender: "System",
                content: `⚠️ **${teamName} failed to respond** — ${error.message}\n\nHR should assess: Does this team need more members, or are there blockers? The board may need to re-delegate or restructure.`,
                type: "system",
                timestamp: new Date(),
            });

            // Add HR escalation message
            (session as any).chatLog.push({
                team: "board",
                sender: "COO",
                content: `The ${teamName} team missed their deadline. HR — please assess team capacity. Do we need to scale up with more heads, or is this a skill gap that requires a different approach?`,
                type: "message",
                timestamp: new Date(),
            });
        }

        await session.save();
    }

    private parseTeamConversation(response: string): { conversation: { agent: string; message: string }[]; synthesis: string; answer: string; resources: any[] } {
        try {
            let jsonStr = "";
            const codeBlockMatch = response.match(/```json\s*([\s\S]+?)\s*```/);
            if (codeBlockMatch) {
                jsonStr = codeBlockMatch[1];
            } else {
                const firstBrace = response.indexOf("{");
                if (firstBrace !== -1) {
                    let depth = 0;
                    let end = firstBrace;
                    for (let i = firstBrace; i < response.length; i++) {
                        if (response[i] === "{") depth++;
                        if (response[i] === "}") depth--;
                        if (depth === 0) { end = i + 1; break; }
                    }
                    jsonStr = response.substring(firstBrace, end);
                }
            }

            if (jsonStr) {
                const parsed = JSON.parse(jsonStr);
                return {
                    conversation: (parsed.conversation || []).map((c: any) => ({
                        agent: c.agent || c.sender || "Team Member",
                        message: c.message || c.content || "",
                    })).filter((c: any) => c.message),
                    synthesis: parsed.synthesis || "",
                    answer: parsed.answer || parsed.response || "",
                    resources: parsed.resources || [],
                };
            }

            // Plain text — treat as single message
            return {
                conversation: [{ agent: "Team Lead", message: response.slice(0, 1000) }],
                synthesis: response.slice(0, 1000),
                answer: response.slice(0, 1000),
                resources: [],
            };
        } catch {
            return {
                conversation: [{ agent: "Team Lead", message: response.slice(0, 1000) }],
                synthesis: response.slice(0, 1000),
                answer: response.slice(0, 1000),
                resources: [],
            };
        }
    }

    private mapRole(role: string): string {
        const validRoles = [
            "ceo", "coo", "cto", "cpo", "cmo", "cfo", "general_counsel",
            "vp_engineering", "vp_product", "vp_marketing", "vp_sales", "vp_design",
            "software_architect", "senior_engineer", "mid_engineer", "junior_engineer",
            "devops_engineer", "qa_engineer", "security_engineer", "data_engineer", "ai_engineer",
            "product_manager", "project_manager", "scrum_master",
            "ux_researcher", "ux_designer", "ui_designer", "brand_designer", "technical_writer",
            "marketing_strategist", "seo_specialist", "content_writer", "social_media_manager",
            "video_creator", "graphic_designer", "email_marketing",
            "sdr", "sales_executive", "customer_success", "crm_manager",
            "analyst", "data_scientist", "customer_support", "hr", "employee",
        ];
        const normalized = role.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
        if (validRoles.includes(normalized)) return normalized;

        // Fuzzy match
        const fuzzyMap: Record<string, string> = {
            researcher: "analyst",
            research: "analyst",
            data_analyst: "analyst",
            marketing: "marketing_strategist",
            market: "marketing_strategist",
            engineer: "senior_engineer",
            developer: "senior_engineer",
            dev: "senior_engineer",
            designer: "ux_designer",
            writer: "content_writer",
            copywriter: "content_writer",
            manager: "project_manager",
            lead: "project_manager",
            team_lead: "project_manager",
            support: "customer_support",
            sales: "sales_executive",
            finance: "cfo",
            technology: "cto",
            product: "product_manager",
            operations: "coo",
            people: "hr",
            hr_manager: "hr",
            quality: "qa_engineer",
            testing: "qa_engineer",
            security: "security_engineer",
            infra: "devops_engineer",
            infrastructure: "devops_engineer",
            content: "content_writer",
            social: "social_media_manager",
            brand: "brand_designer",
            ux: "ux_designer",
            ui: "ui_designer",
            video: "video_creator",
            graphic: "graphic_designer",
            email: "email_marketing",
            crm: "crm_manager",
            customer: "customer_success",
            success: "customer_success",
            ai: "ai_engineer",
            machine_learning: "ai_engineer",
            ml: "ai_engineer",
            data: "data_engineer",
            science: "data_scientist",
            scikit: "data_scientist",
            legal: "general_counsel",
            counsel: "general_counsel",
            architecture: "software_architect",
            architect: "software_architect",
            scrum: "scrum_master",
            agile: "scrum_master",
            product_owner: "product_manager",
            po: "product_manager",
            pm: "project_manager",
            sdet: "qa_engineer",
            devsecops: "security_engineer",
            secops: "security_engineer",
            growth: "marketing_strategist",
            seo: "seo_specialist",
            sem: "seo_specialist",
            paid: "marketing_strategist",
            ads: "marketing_strategist",
            paid_ads: "marketing_strategist",
        };

        // Try partial match
        for (const [key, val] of Object.entries(fuzzyMap)) {
            if (normalized.includes(key) || key.includes(normalized)) return val;
        }

        return "employee"; // fallback
    }

    private mapRank(rank: string): string {
        const validRanks = [
            "intern", "junior", "mid_level", "senior", "staff", "principal",
            "director", "vice_president", "executive", "c_level",
        ];
        const normalized = rank.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
        if (validRanks.includes(normalized)) return normalized;

        const rankMap: Record<string, string> = {
            mid: "mid_level",
            middle: "mid_level",
            intermediate: "mid_level",
            lead: "senior",
            team_lead: "senior",
            head: "director",
            director_level: "director",
            vp: "vice_president",
            c_level_executive: "c_level",
            entry: "junior",
            entry_level: "junior",
            graduate: "junior",
            associate: "junior",
            experienced: "senior",
            senior_lead: "staff",
            principal_engineer: "principal",
            chief: "c_level",
           CXO: "c_level",
        };

        for (const [key, val] of Object.entries(rankMap)) {
            if (normalized === key || normalized.includes(key)) return val;
        }

        return "mid_level"; // fallback
    }

    private mapDepartment(dept: string): string {
        const validDepts = [
            "executive", "engineering", "product", "design", "marketing",
            "sales", "analytics", "security", "legal", "finance", "support", "operations",
        ];
        const normalized = dept.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
        if (validDepts.includes(normalized)) return normalized;

        const deptMap: Record<string, string> = {
            research: "analytics",
            data: "analytics",
            tech: "engineering",
            development: "engineering",
            software: "engineering",
            dev: "engineering",
            hr: "operations",
            people: "operations",
            culture: "operations",
            admin: "operations",
            biz: "sales",
            business: "sales",
            revenue: "sales",
            growth: "marketing",
            brand: "marketing",
            content: "marketing",
            comms: "marketing",
            communications: "marketing",
            product_design: "design",
            ux: "design",
            ui: "design",
            creative: "design",
            visual: "design",
            legal_compliance: "legal",
            compliance: "legal",
            risk: "legal",
            accounting: "finance",
            treasury: "finance",
            procurement: "finance",
            help: "support",
            customer_service: "support",
            cs: "support",
            cx: "support",
            quality: "engineering",
            qa: "engineering",
            test: "engineering",
            infra: "engineering",
            infrastructure: "engineering",
            platform: "engineering",
            ai: "engineering",
            ml: "engineering",
            data_science: "analytics",
            bi: "analytics",
            intelligence: "analytics",
        };

        for (const [key, val] of Object.entries(deptMap)) {
            if (normalized.includes(key) || key.includes(normalized)) return val;
        }

        return "operations"; // fallback
    }

    private async assembleTeam(companyId: string, action: any): Promise<{ team: any; agents: any[] }> {
        const teamName = action.teamName || action.name;
        const department = this.mapDepartment(action.department || "operations");
        const description = action.description || "";
        const roles: any[] = action.roles || [];

        // Create the team
        const team = await Team.create({
            uid: uuidv4(),
            name: teamName,
            slug: teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
            company: companyId,
            department,
            description,
            status: "active",
        });

        const createdAgents: any[] = [];
        let leadAgent: any = null;

        // Create agents for each role specified
        for (const roleSpec of roles) {
            const isLead = roles.length === 1 || roleSpec.rank === "lead" || roleSpec.rank === "director" || roleSpec.rank === "senior";
            const mappedRole = this.mapRole(roleSpec.role || "employee");
            const mappedRank = this.mapRank(isLead ? "senior" : (roleSpec.rank || "mid_level"));
            const agent = await Agent.create({
                uid: uuidv4(),
                name: roleSpec.name,
                role: mappedRole,
                rank: mappedRank,
                company: companyId,
                team: team._id,
                status: "idle",
                systemPrompt: roleSpec.description || `You are a ${roleSpec.name} at the company.`,
                persona: {
                    personality: ["collaborative", "reliable", "leadership"],
                    workingStyle: roleSpec.description || "Completes assigned work reliably.",
                    communicationStyle: "Clear and professional.",
                },
            });
            createdAgents.push(agent);
            if (isLead && !leadAgent) leadAgent = agent;
        }

        // If no roles specified, create a default lead
        if (createdAgents.length === 0) {
            const lead = await Agent.create({
                uid: uuidv4(),
                name: `${teamName} Lead`,
                role: "project_manager",
                rank: "senior",
                company: companyId,
                team: team._id,
                status: "idle",
                systemPrompt: `You are the team lead for ${teamName}. You manage the team, coordinate work, and report to the board.`,
                persona: {
                    personality: ["organized", "leadership", "communicative"],
                    workingStyle: "Manages team operations and reports to leadership.",
                    communicationStyle: "Clear, structured, and proactive.",
                },
            });
            createdAgents.push(lead);
            leadAgent = lead;
        }

        // Update team with agents and lead
        team.agents = createdAgents.map((a) => a._id);
        if (leadAgent) {
            team.lead = leadAgent._id;
        }
        await team.save();

        return { team, agents: createdAgents };
    }

    private async completeSession(sessionId: string, reason: string) {
        const session = await BrainstormSession.findById(sessionId);
        if (session) {
            // Clean up any orphaned typing indicators
            const log = (session as any).chatLog || [];
            for (let i = log.length - 1; i >= 0; i--) {
                if (log[i].type === "typing" && log[i].typing === true) {
                    log.splice(i, 1);
                }
            }
            await session.save();
        }

        await BrainstormSession.findOneAndUpdate(
            { _id: sessionId },
            {
                status: "completed",
                completedAt: new Date(),
            }
        );
        console.log(`Brainstorm session ${sessionId} completed: ${reason}`);
    }

    private loadPrompt(filename: string): string {
        try {
            return fs.readFileSync(path.join(PROMPTS_DIR, filename), "utf-8");
        } catch {
            return "";
        }
    }

    async resumeRunningSessions() {
        const runningSessions = await BrainstormSession.find({ status: "running" });
        console.log(`[Brainstorm] Found ${runningSessions.length} running session(s) to resume`);

        for (const session of runningSessions) {
            console.log(`[Brainstorm] Resuming session ${session.uid} (company: ${session.company})`);
            this.runBrainstormLoop(session._id.toString()).catch((err) => {
                console.error(`[Brainstorm] Failed to resume session ${session.uid}:`, err);
            });
        }
    }
}

export const brainstormService = BrainstormService.getInstance();
export default brainstormService;
