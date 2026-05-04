import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { LogDocument } from './common/db/log.model';
export declare class AppWorker extends WorkerHost {
    private readonly configService;
    private readonly userLogModel;
    constructor(configService: ConfigService, userLogModel: Model<LogDocument>);
    process(job: Job): Promise<{
        success: boolean;
        email: string;
        message: string;
    }>;
    private handleEmailJob;
    private handleLogJob;
    onActive(job: Job): void;
    onFailed(job: Job, error: Error): void;
    onCompleted(job: Job): void;
    onStalled(job: Job): void;
}
