import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { AppWorker } from './app.worker';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BullModule.forRoot({
    connection: {
      host: 'localhost',
      port: 6379,
    },
    defaultJobOptions:{
      attempts:3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      delay: 1000,
      removeOnComplete: 1000,
      removeOnFail: 500,
    }
  }),
  BullModule.registerQueue({
    name: 'job-queue',
  }),
  ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  })],
  controllers: [AppController],
  providers: [AppService,AppWorker],
})
export class AppModule {}
