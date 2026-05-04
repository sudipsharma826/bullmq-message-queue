# BullMQ Message Queue

<p align="center">
  <img src="https://res.cloudinary.com/diuy2xilf/image/upload/v1760314904/portfolio/qjl8mv0wvcic9kazotnx.png" alt="Mibe logo" width="180" />
</p>

## Overview

BullMQ Message Queue is a NestJS-based background processing service built with BullMQ, Redis, MongoDB, and Resend. It demonstrates how to handle login-related work asynchronously instead of doing everything inside a single HTTP request.

The project is designed to:

- accept login requests
- enqueue background jobs
- send login notification emails
- store login activity in MongoDB
- expose queue and log status endpoints for monitoring

## Why This Project Exists

This project was built to show a practical message-queue workflow for a real application. Instead of processing email delivery and audit logging directly in the request lifecycle, the app pushes work into BullMQ workers. That makes the API faster, the processing more reliable, and the system easier to extend.

It is useful as a reference for:

- job queues in NestJS
- worker-based background processing
- email notifications with Resend
- MongoDB upserts for login logs
- queue event tracking and progress updates

## What It Showcases

This repository showcases a small but complete backend flow:

1. A user submits login data through the API.
2. The service validates the credentials.
3. Two jobs are queued: one to send an email and one to log the login.
4. The worker processes the jobs, updates progress, and handles retries.
5. Queue events and stored logs can be inspected through the API.

## Features

- NestJS application structure
- BullMQ queue and worker setup
- Redis-backed job processing
- MongoDB login log storage
- Resend email notification template with branding
- Queue event listeners for added, active, completed, and failed jobs
- Basic API endpoints for login, job inspection, and stored logs

## API Endpoints

### `GET /`
Returns a simple health-style message confirming the app is running.

### `POST /login`
Queues the login workflow.

Request body:

```json
{
  "email": "user@example.com",
  "password": "bullmq"
}
```

The request creates two jobs:

- `email-job` for the notification email
- `log-job` for storing the login record

### `GET /jobs`
Returns the current queue state, including waiting, active, completed, failed, and delayed jobs.

### `GET /logs`
Returns the latest stored login records from MongoDB.

## Configuration

Create a `.env` file in the project root with the required services:

```bash
PORT=3000
REDIS_URL=redis://localhost:6379
DATABASE_URL=mongodb://localhost:27017/bullmq-message-queue
RESEND_API_KEY=your_resend_api_key
```

The app uses these values:

- `PORT` for the HTTP server port
- `REDIS_URL` for BullMQ and queue storage
- `DATABASE_URL` for MongoDB
- `RESEND_API_KEY` for email delivery

## Run Locally

```bash
npm install
npm run start:dev
```

## Build And Test

```bash
npm run build
npm run test
npm run test:e2e
```

## Follow Me

- Portfolio: [sudipsharma.com.np](https://sudipsharma.com.np)
- Contact: sudeepsharma826@gmail.com

## Support

For support or questions about this project, contact the maintainer at sudeepsharma826@gmail.com.

## License

MIT License



