import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
export declare class AppWorker extends WorkerHost {
    private readonly configService;
    constructor(configService: ConfigService);
    process(job: Job): Promise<import("resend").CreateEmailResponseSuccess>;
    onActive(job: Job): void;
    onFailed(job: Job, error: Error): void;
    onCompleted(job: Job): void;
    onStalled(job: Job): void;
}
