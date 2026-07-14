import * as cron from "node-cron";
import CronJob from "../models/cronJob.model";
import eventBus from "../events/eventBus";

class Scheduler {
    private static instance: Scheduler;
    private jobs: Map<string, cron.ScheduledTask> = new Map();
    private pollingInterval: NodeJS.Timeout | null = null;

    static getInstance(): Scheduler {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler();
        }
        return Scheduler.instance;
    }

    async loadJobs() {
        const jobs = await CronJob.find({ status: "active" });
        for (const job of jobs) {
            this.scheduleJob(job);
        }
        console.log(`[Scheduler] Loaded ${jobs.length} cron jobs from database`);
    }

    scheduleJob(job: any) {
        if (this.jobs.has(job._id.toString())) {
            this.jobs.get(job._id.toString())?.stop();
        }
        if (!cron.validate(job.cronExpression)) {
            console.error(`[Scheduler] Invalid cron expression: ${job.cronExpression} for job ${job.name}`);
            return;
        }
        const task = cron.schedule(job.cronExpression, async () => {
            try {
                console.log(`[Scheduler] Running job: ${job.name}`);
                await CronJob.findByIdAndUpdate(job._id, { lastRunAt: new Date(), $inc: { runCount: 1 } });
                eventBus.publish("cron:execute", { jobId: job._id, type: job.type, payload: job.payload });
            } catch (error: any) {
                console.error(`[Scheduler] Job ${job.name} failed:`, error.message);
                await CronJob.findByIdAndUpdate(job._id, {
                    lastResult: { success: false, error: error.message },
                    status: "failed",
                });
            }
        }, { timezone: job.timezone || "UTC" });
        this.jobs.set(job._id.toString(), task);
    }

    stopJob(jobId: string) {
        const task = this.jobs.get(jobId);
        if (task) {
            task.stop();
            this.jobs.delete(jobId);
        }
    }

    startPolling(intervalMs: number = 60000) {
        this.pollingInterval = setInterval(async () => {
            await this.loadJobs();
        }, intervalMs);
    }

    stopAll() {
        this.jobs.forEach((task) => task.stop());
        this.jobs.clear();
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
}

export const scheduler = Scheduler.getInstance();
export default scheduler;
