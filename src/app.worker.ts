import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { sendLoginNotification } from './common/config/resend';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Processor('job-queue', {
  concurrency: 2,
  lockDuration: 300000,
  limiter: {
    max: 5,
    duration: 60000,
  },
})
export class AppWorker extends WorkerHost {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async process(job: Job) {
    console.log(
      `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`,
    );

    const totalSteps = 3;
    const { email, lastLogin } = job.data;

    let result: any;

    for (let step = 1; step <= totalSteps; step++) {
      switch (step) {
        case 1:
          //  Step 1: Validate data
          if (!email || !lastLogin) {
            throw new BadRequestException ('Invalid job data');
          }
          console.log('Step 1: Data validated');
          break;

        case 2:
          //  Step 2: Send email
          result = await sendLoginNotification(
            email,
            lastLogin,
            this.configService,
          );

          if (!result) {
            throw new Error ('Email sending failed');
          }

          console.log('Step 2: Email sent');
          break;

        case 3:
          //  Step 3: Finalize
          console.log('Step 3: Finalizing job');
          break;
      }

      //  Update progress
      const progress = Math.round((step / totalSteps) * 100);

      await job.updateProgress({
        step,
        totalSteps,
        percent: progress,
      });

      console.log(`Job ${job.id} progress: ${progress}%`);
    }

    // Return Data
    return {
      success: true,
      email,
      message: 'Login notification sent successfully',
    };
  }

  // Worker Event Listeners
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
    console.log(`Attempts made: ${job.attemptsMade}`);
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    console.warn(`Job ${job.id} has stalled and will be retried`);
  }
}