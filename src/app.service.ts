import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginData } from './types/login';
import bcrypt from 'bcrypt';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hi BullMQ is up and running!';
  }
  async getLogin(loginData: LoginData, loginQueue: Queue) {
    const { email, password } = loginData;
    // fake login  data
    const userData = {
      password: await bcrypt.hash('bullmq', 10),
      image: 'https://avatars.githubusercontent.com/u/90665217?v=4&size=64',
      isAdmin: 'true',
      lastLogin: new Date().toISOString(),
    };

    // Check the email and password
    if(!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    // Check if the email and password match
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Add the email to the queue for processing
    await loginQueue.add('email-job', { // email-job is the job name
      email: email,
      lastLogin: userData.lastLogin,
     }, {
      // Job Level Options
      // jobId: `email-job-${userData.email}`,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      delay: 1000, // deplay to process the job after 1 second
      removeOnComplete: true, // can assigned the number of job to remove after completion
      removeOnFail: true,// Retry the job up to 3 times with an exponential backoff strategy and include numberof the jon that to remove after failure , depend of the test handling secanrio.
    });

    // Multiple Job name in the same queue
    await loginQueue.add('log-job', { // log-job is the job name
      email: email,
      lastLogin: userData.lastLogin,
      }, {
      // Job-level options
      attempts: 1,
  });


    return {
      email: email,
      image: userData.image,
      isAdmin: userData.isAdmin,
      lastLogin: userData.lastLogin,
    }
  }
}
