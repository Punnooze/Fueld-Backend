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
exports.WeightService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const settings_service_1 = require("../settings/settings.service");
const weight_log_schema_1 = require("./schemas/weight-log.schema");
let WeightService = class WeightService {
    weightModel;
    settingsService;
    constructor(weightModel, settingsService) {
        this.weightModel = weightModel;
        this.settingsService = settingsService;
    }
    computeBmi(weight, height) {
        if (!height)
            return null;
        return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
    }
    async findInRange(startDate, endDate) {
        const { height } = await this.settingsService.getSettings();
        const entries = await this.weightModel
            .find({ date: { $gte: startDate, $lte: endDate } })
            .sort({ date: 1 })
            .exec();
        return entries.map((e) => ({ ...e.toObject(), bmi: this.computeBmi(e.weight, height) }));
    }
    async findLatest() {
        const { height } = await this.settingsService.getSettings();
        const entry = await this.weightModel.findOne().sort({ date: -1 }).exec();
        if (!entry)
            return null;
        return { ...entry.toObject(), bmi: this.computeBmi(entry.weight, height) };
    }
    create(dto) {
        return this.weightModel.create({ ...dto, loggedAt: new Date() });
    }
    async remove(id) {
        const entry = await this.weightModel.findById(id).exec();
        if (!entry)
            throw new common_1.NotFoundException('Weight entry not found');
        await entry.deleteOne();
    }
};
exports.WeightService = WeightService;
exports.WeightService = WeightService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weight_log_schema_1.WeightLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        settings_service_1.SettingsService])
], WeightService);
//# sourceMappingURL=weight.service.js.map