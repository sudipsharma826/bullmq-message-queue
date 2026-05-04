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
var AppEventListener_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEventListener = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let AppEventListener = AppEventListener_1 = class AppEventListener extends bullmq_1.QueueEventsHost {
    logger = new common_1.Logger(AppEventListener_1.name);
    onAdded(job) {
        this.logger.log(`Job added: ${job.jobId} with name: ${job.name}`);
    }
    onActive(job) {
        this.logger.log(`Job active: ${job.jobId}`);
    }
    onCompleted(job) {
        this.logger.log(`Job completed: ${job.jobId}`);
    }
    onFailed(job, error) {
        this.logger.error(`Job failed: ${job.jobId}, Error: ${error.message}`);
    }
};
exports.AppEventListener = AppEventListener;
__decorate([
    (0, bullmq_1.OnQueueEvent)('added'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppEventListener.prototype, "onAdded", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppEventListener.prototype, "onActive", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppEventListener.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnQueueEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Error]),
    __metadata("design:returntype", void 0)
], AppEventListener.prototype, "onFailed", null);
exports.AppEventListener = AppEventListener = AppEventListener_1 = __decorate([
    (0, bullmq_1.QueueEventsListener)('job-queue')
], AppEventListener);
//# sourceMappingURL=app.event.listener.js.map