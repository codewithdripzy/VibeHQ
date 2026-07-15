import type { ToolDefinition, ToolContext, ToolResult } from '../registry';
import { toolRegistry } from '../registry';

const BRAVE_SEARCH_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';

const webSearchTool: ToolDefinition = {
    name: 'web_search',
    description: 'Search the web using Brave Search API. Returns titles, URLs, and snippets for relevant results.',
    parameters: {
        query: { type: 'string', description: 'The search query string', required: true },
        count: { type: 'number', description: 'Number of results to return (default 5, max 20)' },
        freshness: { type: 'string', description: 'Filter by freshness: pd (past day), pw (past week), pm (past month), py (past year)' },
    },

    async execute(params: Record<string, any>, _context: ToolContext): Promise<ToolResult> {
        const { query, count = 5, freshness } = params;

        if (!query) {
            return { success: false, error: 'query parameter is required' };
        }

        const apiKey = process.env.BRAVE_SEARCH_API_KEY;

        if (!apiKey) {
            return {
                success: false,
                error: 'BRAVE_SEARCH_API_KEY environment variable is not set',
                metadata: {
                    hint: 'Set BRAVE_SEARCH_API_KEY in your environment to enable web search',
                },
            };
        }

        try {
            const url = new URL(BRAVE_SEARCH_ENDPOINT);
            url.searchParams.set('q', query);
            url.searchParams.set('count', String(Math.min(Math.max(1, count), 20)));
            if (freshness) {
                url.searchParams.set('freshness', freshness);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': apiKey,
                },
            });

            if (!response.ok) {
                const body = await response.text();
                return {
                    success: false,
                    error: `Brave Search API returned ${response.status}: ${body}`,
                };
            }

            const data = await response.json();
            const results = (data.web?.results ?? []).map((r: any) => ({
                title: r.title,
                url: r.url,
                description: r.description,
                age: r.age ?? null,
                language: r.language ?? null,
            }));

            return {
                success: true,
                data: {
                    query,
                    results,
                    totalResults: results.length,
                },
                metadata: {
                    provider: 'brave-search',
                    providerResults: data.web?.results?.length ?? 0,
                },
            };
        } catch (error: any) {
            return { success: false, error: `Web search failed: ${error.message}` };
        }
    },
};

export function registerWebSearch(): void {
    toolRegistry.register(webSearchTool);
}

export default webSearchTool;
