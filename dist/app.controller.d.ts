import { AppService } from './app.service';
import type { LoginData } from './types/login';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { LogDocument } from './common/db/log.model';
import { ConfigService } from '@nestjs/config';
export declare class AppController {
    private readonly appService;
    private readonly loginQueue;
    private readonly userLogModel;
    private readonly configService;
    constructor(appService: AppService, loginQueue: Queue, userLogModel: Model<LogDocument>, configService: ConfigService);
    getHello(): string;
    getLogin(loginData: LoginData): Promise<{
        email: string;
        image: string;
        isAdmin: string;
        lastLogin: string;
    }>;
    getJobs(): Promise<{
        waiting: {
            id: any;
            name: any;
            data: any;
            progress: any;
            attemptsMade: any;
            finishedOn: any;
            processedOn: any;
            failedReason: any;
        }[];
        active: {
            id: any;
            name: any;
            data: any;
            progress: any;
            attemptsMade: any;
            finishedOn: any;
            processedOn: any;
            failedReason: any;
        }[];
        completed: {
            id: any;
            name: any;
            data: any;
            progress: any;
            attemptsMade: any;
            finishedOn: any;
            processedOn: any;
            failedReason: any;
        }[];
        failed: {
            id: any;
            name: any;
            data: any;
            progress: any;
            attemptsMade: any;
            finishedOn: any;
            processedOn: any;
            failedReason: any;
        }[];
        delayed: {
            id: any;
            name: any;
            data: any;
            progress: any;
            attemptsMade: any;
            finishedOn: any;
            processedOn: any;
            failedReason: any;
        }[];
    }>;
    getLogs(): Promise<(import("./common/db/log.model").Log & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
