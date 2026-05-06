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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_settings_schema_1 = require("./schemas/user-settings.schema");
let SettingsService = class SettingsService {
    settingsModel;
    constructor(settingsModel) {
        this.settingsModel = settingsModel;
    }
    async getSettings() {
        const settings = await this.settingsModel.findOne().exec();
        if (settings)
            return settings;
        return this.settingsModel.create({});
    }
    async update(dto) {
        const result = await this.settingsModel
            .findOneAndUpdate({}, { $set: dto }, { upsert: true, new: true })
            .exec();
        return result;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_settings_schema_1.UserSettings.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SettingsService);
//# sourceMappingURL=settings.service.js.map