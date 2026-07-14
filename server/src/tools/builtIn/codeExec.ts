import { execSync } from 'node:child_process';
import type { ToolDefinition, ToolContext, ToolResult } from '../registry.js';
import { toolRegistry } from '../registry.js';

const MAX_TIMEOUT_MS = 60_000;
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_OUTPUT_BYTES = 512_000;

const LANGUAGES: Record<string, { command: string; ext: string }> = {
    python: { command: 'python3', ext: '.py' },
    javascript: { command: 'node', ext: '.js' },
    bash: { command: 'bash', ext: '.sh' },
};

const codeExecTool: ToolDefinition = {
    name: 'code_exec',
    description: 'Execute a code snippet in a sandboxed subprocess. Supports python, javascript, and bash. Output is captured and returned.',
    parameters: {
        language: { type: 'string', description: 'Language to execute: python, javascript, or bash', required: true },
        code: { type: 'string', description: 'The code snippet to execute', required: true },
        timeout: { type: 'number', description: 'Timeout in milliseconds (default 30000, max 60000)' },
        args: { type: 'string', description: 'Additional arguments to pass to the command (space-separated string)' },
    },

    async execute(params: Record<string, any>, _context: ToolContext): Promise<ToolResult> {
        const { language, code, timeout = DEFAULT_TIMEOUT_MS, args = '' } = params;

        if (!language || !code) {
            return { success: false, error: 'language and code parameters are required' };
        }

        const lang = LANGUAGES[language.toLowerCase()];
        if (!lang) {
            return {
                success: false,
                error: `Unsupported language: '${language}'. Supported: ${Object.keys(LANGUAGES).join(', ')}`,
            };
        }

        if (typeof code !== 'string' || code.trim().length === 0) {
            return { success: false, error: 'code must be a non-empty string' };
        }

        const fs = await import('node:fs/promises');
        const os = await import('node:os');
        const path = await import('node:path');

        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codeexec-'));
        const filePath = path.join(tmpDir, `exec${lang.ext}`);

        try {
            await fs.writeFile(filePath, code, 'utf-8');

            const clampedTimeout = Math.min(Math.max(1000, timeout), MAX_TIMEOUT_MS);
            const cmd = `${lang.command} ${args ? args + ' ' : ''}${filePath}`;

            const output = execSync(cmd, {
                timeout: clampedTimeout,
                maxBuffer: MAX_OUTPUT_BYTES,
                cwd: tmpDir,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
            }) as unknown as { stdout: string; stderr: string };

            return {
                success: true,
                data: {
                    stdout: output.stdout ?? '',
                    stderr: output.stderr ?? '',
                    exitCode: 0,
                    language: language.toLowerCase(),
                },
            };
        } catch (error: any) {
            const stdout = error.stdout ?? '';
            const stderr = error.stderr ?? error.message ?? '';

            return {
                success: false,
                error: `Process exited with code ${error.status ?? 'unknown'}`,
                data: {
                    stdout: typeof stdout === 'string' ? stdout : stdout.toString('utf-8'),
                    stderr: typeof stderr === 'string' ? stderr : stderr.toString('utf-8'),
                    exitCode: error.status ?? 1,
                    language: language.toLowerCase(),
                },
            };
        } finally {
            const fs2 = await import('node:fs/promises');
            await fs2.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
        }
    },
};

export function registerCodeExec(): void {
    toolRegistry.register(codeExecTool);
}

export default codeExecTool;
