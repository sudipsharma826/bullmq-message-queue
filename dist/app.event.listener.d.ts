import { QueueEventsHost } from "@nestjs/bullmq";
export declare class AppEventListener extends QueueEventsHost {
    private readonly logger;
    onAdded(job: {
        jobId: string;
        name: string;
    }): void;
    onActive(job: {
        jobId: string;
    }): void;
    onCompleted(job: {
        jobId: string;
    }): void;
    onFailed(job: {
        jobId: string;
    }, error: Error): void;
}
