import { v4 as uuidv4 } from "uuid";
import { BrainstormSession } from "../models/brainstormSession.model";
import { chat } from "../llm/router";
import type { LLMMessage } from "../llm/provider";
import { toolRegistry, ToolResult } from "../tools/registry";
import { Company } from "../models/company.model";
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
    timeLimitMinutes?: number;
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
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + (config.timeLimitMinutes || 10));

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

        const systemPrompt = this.buildSystemPrompt(
            prompt,
            commPrompt,
            basePrompt,
            company,
            session
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

        let turns = 0;
        const maxTurns = session.maxTurns || 30;
        const agents = ["CEO", "CTO", "CMO", "CFO", "COO"];

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

            // Dynamic delay: 500ms to 3s to simulate agent thinking
            const delay = 500 + Math.random() * 2500;
            await new Promise(resolve => setTimeout(resolve, delay));

            // Rotate agent for each turn to simulate different team members
            const currentAgent = agents[turns % agents.length];

            // Inject full conversation context so all agents can see everything
            const conversationSummary = this.buildConversationSummary(currentSession);
            const agentContext = `\n\n--- AGENT CONTEXT ---\nYou are acting as: ${currentAgent}\nFull conversation across all teams:\n${conversationSummary}\n--- END CONTEXT ---`;

            // Add agent context to the last user message for visibility
            if (messages.length > 0) {
                const lastMsg = messages[messages.length - 1];
                if (lastMsg.role === "user") {
                    lastMsg.content += agentContext;
                } else {
                    messages.push({ role: "user", content: `Current state:${agentContext}` });
                }
            }

            await currentSession.save();

            try {
                const response = await chat(messages, session.company.toString());
                messages.push({ role: "assistant", content: response.content });

                const actions = this.parseBrainstormResponse(response.content);

                for (const action of actions) {
                    if (action.type === "search") {
                        const searchResult = await this.executeSearch(
                            action.query,
                            session.company.toString()
                        );
                        messages.push({
                            role: "user",
                            content: `Search results for "${action.query}":\n${JSON.stringify(searchResult, null, 2)}`,
                        });

                        // Add chat message for search
                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: "Research",
                            content: `Searching for: "${action.query}"`,
                            type: "message",
                            timestamp: new Date(),
                        });

                        // Update question with search data
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
                        currentSession.delegations.push({
                            to: action.to,
                            question: action.question,
                            context: action.context || "",
                            status: "pending",
                            createdAt: new Date(),
                        } as any);

                        // Build detailed delegation message
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

                        // Add delegation chat messages
                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: "CEO",
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

                        // Update the question status
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
                                    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
                                    status: "pending",
                                };
                            }
                        }
                    }

                    if (action.type === "delegate_response") {
                        // Find the matching delegation and update it
                        const delegation = currentSession.delegations.find(
                            (d: any) => d.to === action.to && d.status !== "completed"
                        );
                        if (delegation) {
                            delegation.status = "completed";
                            delegation.response = action.answer;
                            delegation.completedAt = new Date();
                            delegation.resources = action.resources || [];
                        }

                        // Build response content with resources
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

                        // Add response chat message to the team's tab
                        (currentSession as any).chatLog.push({
                            team: action.to,
                            sender: action.to.charAt(0).toUpperCase() + action.to.slice(1),
                            content: responseContent,
                            type: "response",
                            resources: action.resources || [],
                            timestamp: new Date(),
                        });

                        // Also add a system notification to board tab
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

                                // Add answer chat message
                                (currentSession as any).chatLog.push({
                                    team: "board",
                                    sender: "CEO",
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

                        // Add new question chat message
                        (currentSession as any).chatLog.push({
                            team: "board",
                            sender: "CEO",
                            content: `New question: "${action.question}"`,
                            type: "message",
                            timestamp: new Date(),
                        });
                    }

                    if (action.type === "next_question") {
                        // Find next pending question
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
                            sender: "CEO",
                            content: `Synthesis complete. Recommendation: ${action.recommendation || "iterate"}. ${action.problemStatement || ""}`,
                            type: "message",
                            timestamp: new Date(),
                        });
                    }

                    if (action.type === "complete") {
                        await this.completeSession(sessionId, "completed");
                        return;
                    }
                }

                await currentSession.save();

                // Build next prompt with current state
                const stateSummary = this.buildStateSummary(currentSession);
                messages.push({
                    role: "user",
                    content: `Current brainstorm state:\n${stateSummary}\n\nContinue the brainstorm. What should we explore next? Use search when you need data. Delegate when you need specialized knowledge. Synthesize when you have enough.`,
                });
            } catch (error: any) {
                console.error(`Brainstorm turn ${turns} failed:`, error.message);
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
        session: any
    ): string {
        let prompt = brainstormPrompt;

        // Interpolate variables
        prompt = prompt.replace(/\{\{company_name\}\}/g, company.name || "Unknown");
        prompt = prompt.replace(/\{\{company_industry\}\}/g, company.industry || "technology");
        prompt = prompt.replace(/\{\{company_description\}\}/g, company.description || "");
        prompt = prompt.replace(/\{\{company_mission\}\}/g, company.mission || "Not yet defined");
        prompt = prompt.replace(/\{\{company_vision\}\}/g, company.vision || "Not yet defined");
        prompt = prompt.replace(/\{\{company_values\}\}/g, (company.values || []).join(", ") || "Not yet defined");
        prompt = prompt.replace(/\{\{session_id\}\}/g, session.uid);
        prompt = prompt.replace(/\{\{max_depth\}\}/g, String(session.maxDepth || 5));
        prompt = prompt.replace(/\{\{max_turns\}\}/g, String(session.maxTurns || 30));
        prompt = prompt.replace(/\{\{time_limit_minutes\}\}/g, String(session.timeLimitMinutes || 10));

        prompt += "\n\n--- COMMUNICATION HIERARCHY ---\n" + commPrompt;

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

    private async completeSession(sessionId: string, reason: string) {
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
}

export const brainstormService = BrainstormService.getInstance();
export default brainstormService;
