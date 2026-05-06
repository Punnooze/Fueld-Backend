"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const settings_module_1 = require("../settings/settings.module");
const measurements_controller_1 = require("./measurements.controller");
const measurements_service_1 = require("./measurements.service");
const body_measurement_schema_1 = require("./schemas/body-measurement.schema");
let MeasurementsModule = class MeasurementsModule {
};
exports.MeasurementsModule = MeasurementsModule;
exports.MeasurementsModule = MeasurementsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: body_measurement_schema_1.BodyMeasurement.name, schema: body_measurement_schema_1.BodyMeasurementSchema },
            ]),
            settings_module_1.SettingsModule,
        ],
        controllers: [measurements_controller_1.MeasurementsController],
        providers: [measurements_service_1.MeasurementsService],
    })
], MeasurementsModule);
//# sourceMappingURL=measurements.module.js.map