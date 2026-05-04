import { AppService } from './app.service';
import type { LoginData } from './types/login';
import { Queue } from 'bullmq';
export declare class AppController {
    private readonly appService;
    private readonly loginQueue;
    constructor(appService: AppService, loginQueue: Queue);
    getHello(): string;
    getLogin(loginData: LoginData): Promise<{
        email: string;
        image: string;
        isAdmin: string;
        lastLogin: string;
    }>;
}
