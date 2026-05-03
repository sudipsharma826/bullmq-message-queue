import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';

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
      delay: 5000,
    }
  }),
  BullModule.registerQueue({
    name: 'job-queue',
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
