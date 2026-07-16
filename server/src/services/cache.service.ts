import Redis from "ioredis";

class CacheService {
    private client: Redis | null = null;
    private isConnected = false;

    constructor() {
        this.connect();
    }

    private connect() {
        try {
            const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
            this.client = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                retryStrategy(times) {
                    const delay = Math.min(times * 50, 2000);
                    return delay;
                },
                lazyConnect: true,
            });

            this.client.on("connect", () => {
                this.isConnected = true;
                console.log("[Cache] Redis connected");
            });

            this.client.on("error", (err) => {
                this.isConnected = false;
                console.error("[Cache] Redis error:", err.message);
            });

            this.client.connect().catch(() => {
                console.warn("[Cache] Redis not available, using memory fallback");
                this.isConnected = false;
            });
        } catch {
            console.warn("[Cache] Redis not available, using memory fallback");
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.isConnected || !this.client) return null;
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        if (!this.isConnected || !this.client) return;
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.client.setex(key, ttlSeconds, serialized);
            } else {
                await this.client.set(key, serialized);
            }
        } catch (err) {
            console.error(`[Cache] Failed to set ${key}:`, err);
        }
    }

    async del(key: string): Promise<void> {
        if (!this.isConnected || !this.client) return;
        try {
            await this.client.del(key);
        } catch {
            // Ignore
        }
    }

    async keys(pattern: string): Promise<string[]> {
        if (!this.isConnected || !this.client) return [];
        try {
            return await this.client.keys(pattern);
        } catch {
            return [];
        }
    }

    isAvailable(): boolean {
        return this.isConnected;
    }
}

export const cache = new CacheService();
export default cache;
