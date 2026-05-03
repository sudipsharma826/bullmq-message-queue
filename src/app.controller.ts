import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import type { LoginData}  from './types/login';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  @InjectQueue('job-queue') private readonly loginQueue : Queue) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post("login")
  getLogin(@Body() loginData: LoginData): void {
    this.appService.getLogin(loginData, this.loginQueue);
  }
}
