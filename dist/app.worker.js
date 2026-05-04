"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppWorker = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const config_1 = require("@nestjs/config");
const resend_1 = require("./common/config/resend");
const bad_request_exception_1 = require("@nestjs/common/exceptions/bad-request.exception");
let AppWorker = class AppWorker extends bullmq_1.WorkerHost {
    configService;
    constructor(configService) {
        super();
        this.configService = configService;
    }
    async process(job) {
        console.log(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);
        const totalSteps = 3;
        const { email, lastLogin } = job.data;
        let result;
        for (let step = 1; step <= totalSteps; step++) {
            switch (step) {
                case 1:
                    if (!email || !lastLogin) {
                        throw new bad_request_exception_1.BadRequestException('Invalid job data');
                    }
                    console.log('Step 1: Data validated');
                    break;
                case 2:
                    result = await (0, resend_1.sendLoginNotification)(email, lastLogin, this.configService);
                    if (!result) {
                        throw new Error('Email sending failed');
                    }
                    console.log('Step 2: Email sent');
                    break;
                case 3:
                    console.log('Step 3: Finalizing job');
                    break;
            }
            const progress = Math.round((step / totalSteps) * 100);
            await job.updateProgress({
                step,
                totalSteps,
                percent: progress,
            });
            console.log(`Job ${job.id} progress: ${progress}%`);
        }
        return {
            success: true,
            email,
            message: 'Login notification sent successfully',
        };
    }
    onActive(job) {
        console.log(`Job ${job.id} is now active`);
    }
    onFailed(job, error) {
        console.error(`Job ${job.id} failed: ${error.message}`);
    }
    onCompleted(job) {
        console.log(`Job ${job.id} completed successfully`);
        console.log(`Attempts made: ${job.attemptsMade}`);
    }
    onStalled(job) {
        console.warn(`Job ${job.id} has stalled and will be retried`);
    }
};
exports.AppWorker = AppWorker;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], AppWorker.prototype, "onActive", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], AppWorker.prototype, "onFailed", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], AppWorker.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('stalled'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], AppWorker.prototype, "onStalled", null);
exports.AppWorker = AppWorker = __decorate([
    (0, bullmq_1.Processor)('job-queue', {
        concurrency: 2,
        lockDuration: 300000,
        limiter: {
            max: 5,
            duration: 60000,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppWorker);
//# sourceMappingURL=app.worker.js.map