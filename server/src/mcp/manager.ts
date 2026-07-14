import { spawn, ChildProcess } from "child_process";
import MCPServer from "../schemas/mcpServer.schema";
import eventBus from "../events/eventBus";

class MCPManager {
    private static instance: MCPManager;
    private processes: Map<string, ChildProcess> = new Map();
    static getInstance(): MCPManager { if (!MCPManager.instance) MCPManager.instance = new MCPManager(); return MCPManager.instance; }

    async startServer(serverId: string): Promise<boolean> {
        const server = await MCPServer.findById(serverId);
        if (!server || !server.isActive) return false;
        if (!server.config || server.transport !== "stdio" || !server.config.command) return false;
        try {
            const proc = spawn(server.config.command, server.config.args || [], {
                env: { ...process.env, ...server.config.env },
                cwd: server.config.workingDir || undefined,
                stdio: ["pipe", "pipe", "pipe"],
            });
            const childProc: ChildProcess = proc;
            this.processes.set(serverId, childProc);
            await MCPServer.findByIdAndUpdate(serverId, { status: "connected", "healthCheck.status": "healthy", "healthCheck.lastChecked": new Date() });
            eventBus.publish("mcp:connected", { serverId, name: server.name });
            childProc.on("error", async () => { await this.handleServerError(serverId, "Process error"); });
            childProc.on("exit", async () => { await this.handleServerError(serverId, "Process exited"); });
            return true;
        } catch (error: any) {
            await MCPServer.findByIdAndUpdate(serverId, { status: "error" });
            return false;
        }
    }

    async stopServer(serverId: string): Promise<boolean> {
        const proc = this.processes.get(serverId);
        if (proc) { proc.kill(); this.processes.delete(serverId); }
        await MCPServer.findByIdAndUpdate(serverId, { status: "disconnected" });
        return true;
    }

    async callTool(serverId: string, toolName: string, args: Record<string, any>): Promise<any> {
        const proc = this.processes.get(serverId);
        if (!proc || !proc.stdin || !proc.stdout) throw new Error("Server not connected");
        const request = JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name: toolName, arguments: args } });
        const stdin = proc.stdin;
        const stdout = proc.stdout;
        return new Promise((resolve, reject) => {
            let responseData = "";
            const timeout = setTimeout(() => { reject(new Error("MCP call timeout")); }, 30000);
            const onData = (chunk: Buffer) => {
                responseData += chunk.toString();
                try {
                    const response = JSON.parse(responseData);
                    clearTimeout(timeout);
                    stdout.off("data", onData);
                    if (response.error) reject(new Error(response.error.message));
                    else resolve(response.result);
                } catch {}
            };
            stdout.on("data", onData);
            stdin.write(request + "\n");
        });
    }

    private async handleServerError(serverId: string, reason: string) {
        this.processes.delete(serverId);
        const server = await MCPServer.findById(serverId);
        if (server && server.autoRestart && server.restartCount < server.maxRestarts) {
            await MCPServer.findByIdAndUpdate(serverId, { $inc: { restartCount: 1 }, "healthCheck.status": "down" });
            setTimeout(() => this.startServer(serverId), 5000);
        } else {
            await MCPServer.findByIdAndUpdate(serverId, { status: "error", "healthCheck.status": "down" });
            eventBus.publish("mcp:error", { serverId, reason });
        }
    }

    async stopAll() { for (const [id] of this.processes) await this.stopServer(id); }
    getProcess(serverId: string): ChildProcess | undefined { return this.processes.get(serverId); }
}

export const mcpManager = MCPManager.getInstance();
export default mcpManager;
