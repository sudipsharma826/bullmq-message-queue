import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendLoginNotification } from './common/config/resend';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { LogDocument } from './common/db/log.model';


@Processor('job-queue', {
  concurrency: 2,
  lockDuration: 300000, // Default 30 sec
  limiter: { // Rate Limiting
    max: 5,
    duration: 60000,
  },
})
export class AppWorker extends WorkerHost {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel('UserLog') private readonly userLogModel: Model<LogDocument>,
  ) {
    super();
  }

  async process(job: Job) {
    console.log(
      `Processing job ${job.id} with name: ${job.name}, data: ${JSON.stringify(job.data)}`,
    );

    const { email, lastLogin } = job.data;
    let result: any;

    // Handle different job names
    switch (job.name) {
      case 'email-job':
        return await this.handleEmailJob(job, email, lastLogin);

      case 'log-job':
        return await this.handleLogJob(job, email, lastLogin);

      default:
        throw new BadRequestException(`Unknown job type: ${job.name}`);
    }
  }

  // Handle email job - sends email notification
  private async handleEmailJob(job: Job, email: string, lastLogin: string) {
    const totalSteps = 3;
    let result: any;

    for (let step = 1; step <= totalSteps; step++) {
      switch (step) {
        case 1:
          // Step 1: Validate data
          if (!email || !lastLogin) {
            throw new BadRequestException('Invalid job data');
          }
          console.log('Step 1: Data validated');
          break;

        case 2:
          // Step 2: Send email
          result = await sendLoginNotification(
            email,
            lastLogin,
            this.configService,
          );

          if (!result) {
            throw new Error('Email sending failed');
          }

          console.log('Step 2: Email sent');
          break;

        case 3:
          // Step 3: Finalize
          console.log('Step 3: Finalizing job');
          break;
      }

      // Update progress
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

  // Handle log job - saves login data to database
  private async handleLogJob(job: Job, email: string, lastLogin: string) {
    try {
      // Step 1: Validate data
      if (!email || !lastLogin) {
        throw new BadRequestException('Invalid job data');
      }
      console.log('Log Job Step 1: Data validated');
      await job.updateProgress({ step: 1, percent: 33 });

      // Step 2: Save to database
      const logEntry = await this.userLogModel.findOneAndUpdate(
        { email },
        { email, lastLogin: new Date(lastLogin) },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      console.log('Log Job Step 2: Data saved to database (upsert)', logEntry);
      await job.updateProgress({ step: 2, percent: 66 });

      // Step 3: Finalize
      console.log('Log Job Step 3: Finalizing job');
      await job.updateProgress({ step: 3, percent: 100 });

      return {
        success: true,
        email,
        message: 'Login data saved successfully',
        logEntry,
      };
    } catch (error) {
      console.error('Log Job failed:', error);
      throw error;
    }
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
