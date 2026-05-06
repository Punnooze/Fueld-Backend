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
exports.MeasurementsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const settings_service_1 = require("../settings/settings.service");
const body_measurement_schema_1 = require("./schemas/body-measurement.schema");
let MeasurementsService = class MeasurementsService {
    measurementModel;
    settingsService;
    constructor(measurementModel, settingsService) {
        this.measurementModel = measurementModel;
        this.settingsService = settingsService;
    }
    computeBodyFat(waist, neck, height) {
        if (!waist || !neck || !height || waist <= neck)
            return null;
        const estimate = 495 /
            (1.0324 -
                0.19077 * Math.log10(waist - neck) +
                0.15456 * Math.log10(height)) -
            450;
        return parseFloat(estimate.toFixed(1));
    }
    findAll() {
        return this.measurementModel.find().sort({ date: -1 }).exec();
    }
    async findLatest() {
        const { height } = await this.settingsService.getSettings();
        const entry = await this.measurementModel.findOne().sort({ date: -1 }).exec();
        if (!entry)
            return null;
        const obj = entry.toObject();
        return {
            ...obj,
            bodyFatEstimate: this.computeBodyFat(obj.waist, obj.neck, height),
        };
    }
    create(dto) {
        return this.measurementModel.create({ ...dto, loggedAt: new Date() });
    }
    async update(id, dto) {
        const entry = await this.measurementModel
            .findByIdAndUpdate(id, { $set: dto }, { new: true })
            .exec();
        if (!entry)
            throw new common_1.NotFoundException('Measurement not found');
        return entry;
    }
    async remove(id) {
        const entry = await this.measurementModel.findById(id).exec();
        if (!entry)
            throw new common_1.NotFoundException('Measurement not found');
        await entry.deleteOne();
    }
};
exports.MeasurementsService = MeasurementsService;
exports.MeasurementsService = MeasurementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(body_measurement_schema_1.BodyMeasurement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        settings_service_1.SettingsService])
], MeasurementsService);
//# sourceMappingURL=measurements.service.js.map