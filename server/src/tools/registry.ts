export interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, { type: string; description: string; required?: boolean }>;
    execute: (params: Record<string, any>, context: ToolContext) => Promise<ToolResult>;
}
export interface ToolContext { companyId: string; agentId: string; agentRole: string; taskId?: string; projectId?: string; }
export interface ToolResult { success: boolean; data?: any; error?: string; metadata?: Record<string, any>; }

class ToolRegistry {
    private static instance: ToolRegistry;
    private tools: Map<string, ToolDefinition> = new Map();
    static getInstance(): ToolRegistry { if (!ToolRegistry.instance) ToolRegistry.instance = new ToolRegistry(); return ToolRegistry.instance; }
    register(tool: ToolDefinition) { this.tools.set(tool.name, tool); }
    get(name: string): ToolDefinition | undefined { return this.tools.get(name); }
    list(): ToolDefinition[] { return Array.from(this.tools.values()); }
    getSchema(): any[] { return this.list().map(t => ({ name: t.name, description: t.description, parameters: t.parameters })); }
    async execute(name: string, params: Record<string, any>, context: ToolContext): Promise<ToolResult> {
        const tool = this.tools.get(name);
        if (!tool) return { success: false, error: `Tool '${name}' not found` };
        try { return await tool.execute(params, context); } catch (error: any) { return { success: false, error: error.message }; }
    }
}
export const toolRegistry = ToolRegistry.getInstance();
export default toolRegistry;
