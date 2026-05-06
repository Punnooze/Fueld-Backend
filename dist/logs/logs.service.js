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
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const log_entry_schema_1 = require("./schemas/log-entry.schema");
let LogsService = class LogsService {
    logModel;
    constructor(logModel) {
        this.logModel = logModel;
    }
    findByDate(date) {
        return this.logModel
            .find({ date })
            .populate('foodItemId')
            .sort({ loggedAt: 1 })
            .exec();
    }
    async findWeek(startDate) {
        const dates = [];
        const start = new Date(startDate);
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        const entries = await this.logModel
            .find({ date: { $in: dates } })
            .populate('foodItemId')
            .sort({ loggedAt: 1 })
            .exec();
        const grouped = {};
        for (const date of dates)
            grouped[date] = [];
        for (const entry of entries)
            grouped[entry.date].push(entry);
        return grouped;
    }
    async findHistory(startDate, endDate) {
        const entries = await this.logModel
            .find({ date: { $gte: startDate, $lte: endDate } })
            .populate('foodItemId')
            .sort({ date: 1, loggedAt: 1 })
            .exec();
        const grouped = {};
        for (const entry of entries) {
            if (!grouped[entry.date])
                grouped[entry.date] = [];
            grouped[entry.date].push(entry);
        }
        return grouped;
    }
    create(dto) {
        return this.logModel.create({
            foodItemId: new mongoose_2.Types.ObjectId(dto.foodItemId),
            quantity: dto.quantity,
            date: dto.date,
            note: dto.note,
            loggedAt: new Date(),
        });
    }
    async remove(id) {
        const entry = await this.logModel.findById(id).exec();
        if (!entry)
            throw new common_1.NotFoundException('Log entry not found');
        await entry.deleteOne();
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(log_entry_schema_1.LogEntry.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LogsService);
//# sourceMappingURL=logs.service.js.map