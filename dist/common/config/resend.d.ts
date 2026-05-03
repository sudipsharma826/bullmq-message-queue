import { ConfigService } from '@nestjs/config';
export declare function sendLoginNotification(email: string, lastLogin: string, configService: ConfigService): Promise<import("resend").CreateEmailResponseSuccess>;
