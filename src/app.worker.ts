import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { sendLoginNotification } from './common/config/resend';

@Processor('job-queue', {
  concurrency: 2,
  lockDuration: 30000,
})
export class AppWorker extends WorkerHost {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  // app worker to process the job
  async process(job: Job) {
    console.log(
      `Processing job with id: ${job.id} and data: ${JSON.stringify(job.data)}`,
    );

    const { email, lastLogin } = job.data;

    const resendEmail = await sendLoginNotification(
      email,
      lastLogin,
      this.configService,
    );

    if (!resendEmail) {
      throw new Error('Failed to send login notification email');
    }

    console.log(`Email sent successfully for job ${job.id}`);

    return resendEmail;
  }
  // Wroker Event Listeners
  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job ${job.id} is now active`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(`Job ${job.id} failed: ${error.message}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    console.warn(`Job ${job.id} has stalled and will be retried`);
  }
}
