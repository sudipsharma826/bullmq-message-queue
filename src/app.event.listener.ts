import {OnQueueEvent,QueueEventsListener,QueueEventsHost} from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { error } from "console";

@QueueEventsListener('job-queue')
export class AppEventListener extends QueueEventsHost {
  private readonly logger = new Logger(AppEventListener.name);  

  //Queue Events
  @OnQueueEvent('added')
  onAdded(job: { jobId: string ,name: string }) {
    this.logger.log(`Job added: ${job.jobId} with name: ${job.name}` );
  }

  @OnQueueEvent('active')
  onActive(job: { jobId: string }) {
    this.logger.log(`Job active: ${job.jobId}`);
  }

  @OnQueueEvent('completed')
  onCompleted(job: { jobId: string }) {
    this.logger.log(`Job completed: ${job.jobId}`);
  }

  @OnQueueEvent('failed')
  onFailed(job: { jobId: string }, error: Error) {
    this.logger.error(`Job failed: ${job.jobId}, Error: ${error.message}`);
  }
}