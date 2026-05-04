"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt_1 = __importDefault(require("bcrypt"));
let AppService = class AppService {
    getHello() {
        return 'Hi BullMQ is up and running!';
    }
    async getLogin(loginData, loginQueue) {
        const { email, password } = loginData;
        const userData = {
            password: await bcrypt_1.default.hash('bullmq', 10),
            image: 'https://avatars.githubusercontent.com/u/90665217?v=4&size=64',
            isAdmin: 'true',
            lastLogin: new Date().toISOString(),
        };
        if (!email || !password) {
            throw new common_1.UnauthorizedException('Email and password are required');
        }
        const isMatch = await bcrypt_1.default.compare(password, userData.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await loginQueue.add('email-job', {
            email: email,
            lastLogin: userData.lastLogin,
        }, {
            attempts: 2,
            backoff: {
                type: 'exponential',
                delay: 1000,
            },
            delay: 1000,
            removeOnComplete: true,
            removeOnFail: true,
        });
        await loginQueue.add('log-job', {
            email: email,
            lastLogin: userData.lastLogin,
        }, {
            attempts: 1,
        });
        return {
            email: email,
            image: userData.image,
            isAdmin: userData.isAdmin,
            lastLogin: userData.lastLogin,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map