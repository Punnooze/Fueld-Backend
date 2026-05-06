"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const settings_module_1 = require("../settings/settings.module");
const weight_controller_1 = require("./weight.controller");
const weight_service_1 = require("./weight.service");
const weight_log_schema_1 = require("./schemas/weight-log.schema");
let WeightModule = class WeightModule {
};
exports.WeightModule = WeightModule;
exports.WeightModule = WeightModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: weight_log_schema_1.WeightLog.name, schema: weight_log_schema_1.WeightLogSchema }]),
            settings_module_1.SettingsModule,
        ],
        controllers: [weight_controller_1.WeightController],
        providers: [weight_service_1.WeightService],
    })
], WeightModule);
//# sourceMappingURL=weight.module.js.map