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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
let AppController = class AppController {
    appService;
    loginQueue;
    userLogModel;
    configService;
    constructor(appService, loginQueue, userLogModel, configService) {
        this.appService = appService;
        this.loginQueue = loginQueue;
        this.userLogModel = userLogModel;
        this.configService = configService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getLogin(loginData) {
        const data = await this.appService.getLogin(loginData, this.loginQueue);
        return data;
    }
    async getJobs() {
        const queue = this.loginQueue;
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            queue.getWaiting(),
            queue.getActive(),
            queue.getCompleted(),
            queue.getFailed(),
            queue.getDelayed(),
        ]);
        const mapJob = (j) => ({
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
    async getLogs() {
        const logs = await this.userLogModel.find().sort({ createdAt: -1 }).limit(50).lean();
        return logs;
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLogin", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Get)('logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLogs", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, bullmq_1.InjectQueue)('job-queue')),
    __param(2, (0, mongoose_1.InjectModel)('UserLog')),
    __metadata("design:paramtypes", [app_service_1.AppService,
        bullmq_2.Queue,
        mongoose_2.Model,
        config_1.ConfigService])
], AppController);
//# sourceMappingURL=app.controller.js.map