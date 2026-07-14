import { toolRegistry } from '../registry.js';
import { registerWebSearch } from './webSearch.js';
import { registerWebFetch } from './webFetch.js';
import { registerCodeExec } from './codeExec.js';
import { registerFileOps } from './fileOps.js';

export function registerBuiltInTools(): void {
    registerWebSearch();
    registerWebFetch();
    registerCodeExec();
    registerFileOps();
}

export { toolRegistry };
export type { ToolDefinition, ToolContext, ToolResult } from '../registry.js';
