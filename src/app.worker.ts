import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { sendLoginNotification } from "./common/config/resend";

@Processor('job-queue')
export class AppWorker extends WorkerHost{
    constructor(private readonly configService: ConfigService) {
        super();
    }

    async process(job: Job) {
    // Task to be performed when the job is processed
    console.log(`Processing job with id: ${job.id} and data: ${JSON.stringify(job.data)}`);
    const { email, lastLogin } = job.data;
    const resendEmail = await sendLoginNotification(email, lastLogin, this.configService);
    if(!resendEmail){
        throw new Error('Failed to send login notification email');
        
    }
}
}