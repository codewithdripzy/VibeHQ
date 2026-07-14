import EventEmitter from "events";

class EventBus extends EventEmitter {
    private static instance: EventBus;
    private constructor() {
        super();
        this.setMaxListeners(50);
    }
    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    publish(event: string, data: any) {
        this.emit(event, data);
        this.emit("*", { event, data, timestamp: new Date() });
    }
    subscribe(event: string, handler: (data: any) => void) {
        this.on(event, handler);
        return () => this.off(event, handler);
    }
}

export const eventBus = EventBus.getInstance();
export default eventBus;
