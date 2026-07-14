import { Agent } from "../models/agent.model";
import { Task } from "../models/task.model";
import { getLLMRouter } from "../llm/router";
import { toolRegistry } from "../tools/registry";
import { mcpManager } from "../mcp/manager";
import eventBus from "../events/eventBus";
import Checkpoint from "../models/checkpoint.model";
import ErrorLog from "../models/errorLog.model";
import MCPServer from "../models/mcpServer.model";

export interface AgentExecutionContext {
    companyId: string;
    agentId: string;
    agentRole: string;
    taskId?: string;
    projectId?: string;
}

export interface AgentStep {
    thought: string;
    action?: string;
    actionInput?: Record<string, any>;
    observation?: string;
    finalAnswer?: string;
}

class AgentEngine {
    private static instance: AgentEngine;
    static getInstance(): AgentEngine { if (!AgentEngine.instance) AgentEngine.instance = new AgentEngine(); return AgentEngine.instance; }

    async runAgent(agentId: string, taskId: string): Promise<string> {
        const agent = await Agent.findById(agentId);
        if (!agent) throw new Error("Agent not found");
        const task = await Task.findById(taskId);
        if (!task) throw new Error("Task not found");

        await Agent.findByIdAndUpdate(agentId, { status: "working", "context.currentTask": taskId });
        await Task.findByIdAndUpdate(taskId, { status: "in_progress" });

        try {
            const tools = this.getAvailableTools(agent);
            const mcpTools = await this.getMCPTools(agent.company.toString());
            const allTools = [...tools, ...mcpTools];

            const systemPrompt = this.buildSystemPrompt(agent, task);
            const messages: any[] = [{ role: "system", content: systemPrompt }];
            let iterations = 0;
            const maxIterations = 10;

            while (iterations < maxIterations) {
                await this.saveCheckpoint(agentId, taskId, iterations);
                const response = await getLLMRouter().chat(messages, agent.company.toString());
                const parsed = this.parseResponse(response.content);
                messages.push({ role: "assistant", content: response.content });

                if (parsed.finalAnswer) {
                    await Task.findByIdAndUpdate(taskId, { status: "completed", output: parsed.finalAnswer });
                    await Agent.findByIdAndUpdate(agentId, { status: "idle", "context.currentTask": null });
                    eventBus.publish("agent:task:completed", { agentId, taskId, output: parsed.finalAnswer });
                    return parsed.finalAnswer;
                }

                if (parsed.action) {
                    const result = await this.executeAction(parsed.action, parsed.actionInput || {}, {
                        companyId: agent.company.toString(),
                        agentId,
                        agentRole: agent.role,
                        taskId,
                        projectId: task.project?.toString(),
                    }, allTools);
                    parsed.observation = JSON.stringify(result);
                    messages.push({ role: "user", content: `Observation: ${parsed.observation}` });
                }
                iterations++;
            }

            const output = "Max iterations reached";
            await Task.findByIdAndUpdate(taskId, { status: "completed", output });
            await Agent.findByIdAndUpdate(agentId, { status: "idle", "context.currentTask": null });
            return output;
        } catch (error: any) {
            await this.handleError(agentId, taskId, error);
            throw error;
        }
    }

    private getAvailableTools(agent: any): any[] {
        const tools = toolRegistry.list();
        return tools.filter(t => {
            if (agent.toolsAccess && agent.toolsAccess.length > 0) {
                return true;
            }
            return true;
        });
    }

    private async getMCPTools(companyId: string): Promise<any[]> {
        const servers = await MCPServer.find({ company: companyId, status: "connected", isActive: true });
        const tools: any[] = [];
        for (const server of servers) {
            for (const tool of server.tools || []) {
                tools.push({
                    name: `mcp_${server.name}_${tool.name}`,
                    description: `[MCP: ${server.name}] ${tool.description}`,
                    parameters: tool.inputSchema?.properties || {},
                    execute: async (params: Record<string, any>) => {
                        return mcpManager.callTool(server._id.toString(), tool.name, params);
                    },
                });
            }
        }
        return tools;
    }

    private buildSystemPrompt(agent: any, task: any): string {
        let prompt = agent.systemPrompt || "";
        prompt += `\n\nCurrent Task: ${task.title}\nDescription: ${task.description}`;
        if (task.context) prompt += `\nContext: ${task.context}`;
        prompt += `\n\nYou have access to tools. Use the following format:\nThought: [your reasoning]\nAction: [tool_name]\nAction Input: [JSON input]\n... (repeat as needed)\nFinal Answer: [your final answer]`;
        return prompt;
    }

    private parseResponse(response: string): AgentStep {
        const step: AgentStep = { thought: "" };
        const thoughtMatch = response.match(/Thought:\s*([\s\S]+?)(?=\n|Action:|$)/);
        if (thoughtMatch) step.thought = thoughtMatch[1].trim();
        const actionMatch = response.match(/Action:\s*(.+?)(?=\n|$)/);
        if (actionMatch) step.action = actionMatch[1].trim();
        const inputMatch = response.match(/Action Input:\s*([\s\S]+?)(?=\n|$)/);
        if (inputMatch) { try { step.actionInput = JSON.parse(inputMatch[1].trim()); } catch { step.actionInput = { input: inputMatch[1].trim() }; } }
        const answerMatch = response.match(/Final Answer:\s*([\s\S]+)$/);
        if (answerMatch) step.finalAnswer = answerMatch[1].trim();
        return step;
    }

    private async executeAction(action: string, input: Record<string, any>, context: AgentExecutionContext, tools: any[]): Promise<any> {
        const tool = tools.find(t => t.name === action);
        if (tool) return await tool.execute(input, context);
        return await toolRegistry.execute(action, input, context);
    }

    private async saveCheckpoint(agentId: string, taskId: string, step: number) {
        await Checkpoint.findOneAndUpdate(
            { agent: agentId, task: taskId },
            { $set: { "state.currentStep": step, "state.data": { step }, isCheckpoint: true } },
            { upsert: true }
        );
    }

    private async handleError(agentId: string, taskId: string, error: Error) {
        await Agent.findByIdAndUpdate(agentId, { status: "idle", "context.currentTask": null });
        await Task.findByIdAndUpdate(taskId, { status: "failed", output: error.message });
        await ErrorLog.create({ company: (await Agent.findById(agentId))?.company, agent: agentId, task: taskId, severity: "high", category: "task_failure", message: error.message, recoveryAction: "escalate", retryCount: 0, maxRetries: 3, impact: { tasksAffected: 1, agentsAffected: 1, downtimeMinutes: 0 }, firstOccurredAt: new Date(), lastOccurredAt: new Date(), occurrenceCount: 1 });
        eventBus.publish("agent:task:failed", { agentId, taskId, error: error.message });
    }
}

export const agentEngine = AgentEngine.getInstance();
export default agentEngine;
