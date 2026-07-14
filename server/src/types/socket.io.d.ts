declare module "socket.io" {
  import { Server as HttpServer } from "http";
  import { EventEmitter } from "events";

  interface ServerOptions {
    cors?: {
      origin?: string | string[];
      methods?: string[];
      credentials?: boolean;
    };
    pingTimeout?: number;
    pingInterval?: number;
  }

  interface Socket {
    id: string;
    handshake: {
      auth: Record<string, any>;
      headers: Record<string, string>;
    };
    join(room: string): void;
    leave(room: string): void;
    emit(event: string, ...args: any[]): boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener?: (...args: any[]) => void): this;
  }

  class Server extends EventEmitter {
    constructor(srv?: HttpServer, opts?: ServerOptions);
    use(fn: (socket: Socket, next: (err?: Error) => void) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
    to(room: string): { emit(event: string, ...args: any[]): boolean };
  }

  export { Server, Socket, ServerOptions };
}
