import { toolRegistry } from '../registry';
import { registerWebSearch } from './webSearch';
import { registerWebFetch } from './webFetch';
import { registerCodeExec } from './codeExec';
import { registerFileOps } from './fileOps';

export function registerBuiltInTools(): void {
    registerWebSearch();
    registerWebFetch();
    registerCodeExec();
    registerFileOps();
}

export { toolRegistry };
export type { ToolDefinition, ToolContext, ToolResult } from '../registry';
