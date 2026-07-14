import type { ToolDefinition, ToolContext, ToolResult } from '../registry.js';
import { toolRegistry } from '../registry.js';

const MAX_BODY_BYTES = 1_024_000; // ~1 MB

const webFetchTool: ToolDefinition = {
    name: 'web_fetch',
    description: 'Fetch content from a URL. Returns the response body as text along with status and headers.',
    parameters: {
        url: { type: 'string', description: 'The URL to fetch (must be http or https)', required: true },
        method: { type: 'string', description: 'HTTP method (default GET)' },
        headers: { type: 'string', description: 'JSON-encoded string of headers to send' },
        timeout: { type: 'number', description: 'Timeout in milliseconds (default 30000, max 120000)' },
    },

    async execute(params: Record<string, any>, _context: ToolContext): Promise<ToolResult> {
        const { url, method = 'GET', headers: rawHeaders, timeout = 30_000 } = params;

        if (!url) {
            return { success: false, error: 'url parameter is required' };
        }

        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch {
            return { success: false, error: `Invalid URL: ${url}` };
        }

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return { success: false, error: `Unsupported protocol: ${parsedUrl.protocol}. Only http and https are supported.` };
        }

        let headers: Record<string, string> = { 'User-Agent': 'VibeHQ-Tool/1.0' };
        if (rawHeaders) {
            try {
                headers = { ...headers, ...JSON.parse(rawHeaders) };
            } catch {
                return { success: false, error: 'headers must be a valid JSON string' };
            }
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Math.min(timeout, 120_000));

        try {
            const response = await fetch(parsedUrl.toString(), {
                method: method.toUpperCase(),
                headers,
                signal: controller.signal,
            });

            clearTimeout(timer);

            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
                return {
                    success: true,
                    data: {
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                        body: `[Body too large: ${contentLength} bytes. Only bodies up to ${MAX_BODY_BYTES} bytes are returned.]`,
                        truncated: true,
                    },
                };
            }

            const body = await response.text();
            const truncated = body.length > MAX_BODY_BYTES;

            return {
                success: true,
                data: {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries()),
                    body: truncated ? body.slice(0, MAX_BODY_BYTES) : body,
                    truncated,
                    finalUrl: response.url,
                },
            };
        } catch (error: any) {
            clearTimeout(timer);
            if (error.name === 'AbortError') {
                return { success: false, error: `Request timed out after ${Math.min(timeout, 120_000)}ms` };
            }
            return { success: false, error: `Fetch failed: ${error.message}` };
        }
    },
};

export function registerWebFetch(): void {
    toolRegistry.register(webFetchTool);
}

export default webFetchTool;
