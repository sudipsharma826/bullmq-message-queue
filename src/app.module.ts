import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { AppWorker } from './app.worker';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppEventListener } from './app.event.listener';
import { MongooseModule } from '@nestjs/mongoose';
import { LogSchema } from './common/db/log.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // BullMQ 
    BullModule.forRootAsync({ // for dev forRoot is used instead of forRootAsync
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // connection :{ used for the development
        //   host:'localhost',
        //   port: 6379,
        // }
        connection: {
          url: config.get<string>('REDIS_URL') || 'redis://localhost:6379',
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          delay: 1000,
          removeOnComplete: 1000,
          removeOnFail: 500,
        },
      }),
    }),

    BullModule.registerQueue({
      name: 'job-queue',
    }),

    //  MongoDB
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'),
      }),
    }),

    MongooseModule.forFeature([
      { name: 'UserLog', schema: LogSchema },
    ]),
  ],

  controllers: [AppController],
  providers: [AppService, AppWorker, AppEventListener],
})
export class AppModule {}