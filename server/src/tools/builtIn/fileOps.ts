import * as path from 'node:path';
import type { ToolDefinition, ToolContext, ToolResult } from '../registry';
import { toolRegistry } from '../registry';

const WORKSPACE_PATH = process.env.TOOL_WORKSPACE_PATH ?? process.cwd();

function resolveSafe(relativePath: string): string {
    const resolved = path.resolve(WORKSPACE_PATH, relativePath);
    if (!resolved.startsWith(WORKSPACE_PATH)) {
        throw new Error(`Path escapes workspace: ${resolved}`);
    }
    return resolved;
}

const fileReadTool: ToolDefinition = {
    name: 'file_read',
    description: 'Read the contents of a file within the workspace.',
    parameters: {
        path: { type: 'string', description: 'Relative path to the file within the workspace', required: true },
        encoding: { type: 'string', description: 'File encoding (default utf-8)' },
    },
    async execute(params: Record<string, any>, _context: ToolContext): Promise<ToolResult> {
        const { path: relPath, encoding = 'utf-8' } = params;
        if (!relPath) return { success: false, error: 'path is required' };

        try {
            const fs = await import('node:fs/promises');
            const absolute = resolveSafe(relPath);
            const content = await fs.readFile(absolute, { encoding: encoding as BufferEncoding });
            const stat = await fs.stat(absolute);

            return {
                success: true,
                data: {
                    content,
                    size: stat.size,
                    modified: stat.mtime.toISOString(),
                    path: relPath,
                },
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

const fileWriteTool: ToolDefinition = {
    name: 'file_write',
    description: 'Write content to a file within the workspace. Creates parent directories as needed. Overwrites existing files.',
    parameters: {
        path: { type: 'string', description: 'Relative path to the file within the workspace', required: true },
        content: { type: 'string', description: 'The content to write to the file', required: true },
        encoding: { type: 'string', description: 'File encoding (default utf-8)' },
    },
    async execute(params: Record<string, any>, _context: ToolContext): Promise<ToolResult> {
        const { path: relPath, content, encoding = 'utf-8' } = params;
        if (!relPath) return { success: false, error: 'path is required' };
        if (content === undefined || content === null) return { success: false, error: 'content is required' };

        try {
            const fs = await import('node:fs/promises');
            const absolute = resolveSafe(relPath);

            await fs.mkdir(path.dirname(absolute), { recursive: true });
            await fs.writeFile(absolute, content, { encoding: encoding as BufferEncoding });

            const stat = await fs.stat(absolute);
            return {
                success: true,
                data: {
                    bytesWritten: stat.size,
                    path: relPath,
                },
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

const fileListTool: ToolDefinition = {
    name: 'file_list',
    description: 'List files and directories at a path within the workspace.',
    parameters: {
        path: { type: 'string', description: 'Relative directory path within the workspace (default ".")' },
        recursive: { type: 'string', description: 'Whether to list recursively: "true" or "false" (default "false")' },
        maxDepth: { type: 'number', description: 'Maximum recursion depth when recursive is true (default 5)' },
    },
    async execute(params: Record<string, any>, _context: ToolContext): Promise<ToolResult> {
        const { path: relPath = '.', recursive = 'false', maxDepth = 5 } = params;

        try {
            const fs = await import('node:fs/promises');
            const absolute = resolveSafe(relPath);

            if (recursive === 'true') {
                const entries: string[] = [];
                const walk = async (dir: string, currentDepth: number) => {
                    if (currentDepth > maxDepth) return;
                    const items = await fs.readdir(dir, { withFileTypes: true });
                    for (const item of items) {
                        const full = path.join(dir, item.name);
                        const rel = path.relative(WORKSPACE_PATH, full);
                        entries.push(`${item.isDirectory() ? 'd' : 'f'} ${rel}`);
                        if (item.isDirectory()) {
                            await walk(full, currentDepth + 1);
                        }
                    }
                };
                await walk(absolute, 0);
                return { success: true, data: { entries, path: relPath, count: entries.length } };
            }

            const items = await fs.readdir(absolute, { withFileTypes: true });
            const entries = items.map((item) => ({
                name: item.name,
                type: item.isDirectory() ? 'directory' : 'file',
                path: path.join(relPath, item.name),
            }));

            return { success: true, data: { entries, path: relPath, count: entries.length } };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },
};

export function registerFileOps(): void {
    toolRegistry.register(fileReadTool);
    toolRegistry.register(fileWriteTool);
    toolRegistry.register(fileListTool);
}

export default { fileReadTool, fileWriteTool, fileListTool };
