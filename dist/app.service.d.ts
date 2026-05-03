import { LoginData } from './types/login';
import { Queue } from 'bullmq';
export declare class AppService {
    getHello(): string;
    getLogin(loginData: LoginData, loginQueue: Queue): Promise<{
        email: string;
        image: string;
        isAdmin: string;
        lastLogin: string;
    }>;
}
