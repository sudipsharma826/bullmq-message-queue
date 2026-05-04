import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginData } from './types/login';
import bcrypt from 'bcrypt';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async getLogin(loginData: LoginData, loginQueue: Queue) {
    const { email, password } = loginData;
    // fake login  data
    const userData = {
      email: 'sudeepsharma826@gmail.com',
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
    await loginQueue.add('email-job', { 
      email: userData.email,
      lastLogin: userData.lastLogin,
     }, {
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

    return {
      email: userData.email,
      image: userData.image,
      isAdmin: userData.isAdmin,
      lastLogin: userData.lastLogin,
    }
  }
}
