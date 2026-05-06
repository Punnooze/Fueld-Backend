"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const foods_module_1 = require("./foods/foods.module");
const logs_module_1 = require("./logs/logs.module");
const measurements_module_1 = require("./measurements/measurements.module");
const seed_module_1 = require("./seed/seed.module");
const settings_module_1 = require("./settings/settings.module");
const weight_module_1 = require("./weight/weight.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    uri: config.get('MONGODB_URI'),
                }),
            }),
            foods_module_1.FoodsModule,
            logs_module_1.LogsModule,
            settings_module_1.SettingsModule,
            weight_module_1.WeightModule,
            measurements_module_1.MeasurementsModule,
            seed_module_1.SeedModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map