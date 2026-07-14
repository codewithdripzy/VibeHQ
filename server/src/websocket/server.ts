import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "vibehq-secret-key";

class WebSocketServer {
    private static instance: WebSocketServer;
    private io: Server | null = null;
    private connectedUsers: Map<string, Socket> = new Map();

    static getInstance(): WebSocketServer {
        if (!WebSocketServer.instance) {
            WebSocketServer.instance = new WebSocketServer();
        }
        return WebSocketServer.instance;
    }

    init(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: { origin: "*", methods: ["GET", "POST"] },
        });
        this.io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            if (!token) return next(new Error("Authentication required"));
            try {
                const decoded = jwt.verify(token, JWT_SECRET) as any;
                (socket as any).userId = decoded.uid;
                (socket as any).companyId = decoded.companyId;
                next();
            } catch {
                next(new Error("Invalid token"));
            }
        });
        this.io.on("connection", (socket) => {
            const userId = (socket as any).userId;
            const companyId = (socket as any).companyId;
            this.connectedUsers.set(userId, socket);
            if (companyId) socket.join(`company:${companyId}`);
            console.log(`[WS] User connected: ${userId}`);
            socket.on("join:channel", (channelId: string) => socket.join(`channel:${channelId}`));
            socket.on("leave:channel", (channelId: string) => socket.leave(`channel:${channelId}`));
            socket.on("join:project", (projectId: string) => socket.join(`project:${projectId}`));
            socket.on("disconnect", () => {
                this.connectedUsers.delete(userId);
                console.log(`[WS] User disconnected: ${userId}`);
            });
        });
    }

    toUser(userId: string, event: string, data: any) {
        this.connectedUsers.get(userId)?.emit(event, data);
    }

    toCompany(companyId: string, event: string, data: any) {
        this.io?.to(`company:${companyId}`).emit(event, data);
    }

    toChannel(channelId: string, event: string, data: any) {
        this.io?.to(`channel:${channelId}`).emit(event, data);
    }

    toProject(projectId: string, event: string, data: any) {
        this.io?.to(`project:${projectId}`).emit(event, data);
    }

    getIO(): Server | null {
        return this.io;
    }
}

export const wsServer = WebSocketServer.getInstance();
export default wsServer;
