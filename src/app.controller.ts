import { Body, Controller, Get, Inject, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';
import type { LoginData } from './types/login';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogDocument } from './common/db/log.model';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('job-queue') private readonly loginQueue: Queue,
    @InjectModel('UserLog') private readonly userLogModel: Model<LogDocument>,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string{
    return this.appService.getHello();
  }

  @Post('login')
  async getLogin(@Body() loginData: LoginData) {
    const data = await this.appService.getLogin(loginData, this.loginQueue);
    return data;
  }

  @Get('jobs')
  async getJobs() {
    const queue = this.loginQueue;

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    const mapJob = (j: any) => ({
      id: j.id,
      name: j.name,
      data: j.data,
      progress: j.progress ?? 0,
      attemptsMade: j.attemptsMade,
      finishedOn: j.finishedOn,
      processedOn: j.processedOn,
      failedReason: j.failedReason ?? null,
    });

    return {
      waiting: waiting.map(mapJob),
      active: active.map(mapJob),
      completed: completed.map(mapJob),
      failed: failed.map(mapJob),
      delayed: delayed.map(mapJob),
    };
  }

  @Get('logs')
  async getLogs() {
    const logs = await this.userLogModel.find().sort({ createdAt: -1 }).limit(50).lean();
    return logs;
  }
}
