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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyMeasurementSchema = exports.BodyMeasurement = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BodyMeasurement = class BodyMeasurement {
    date;
    loggedAt;
    neck;
    chest;
    waist;
    hip;
    rightArm;
    leftArm;
    forearm;
    thigh;
    calf;
};
exports.BodyMeasurement = BodyMeasurement;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BodyMeasurement.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], BodyMeasurement.prototype, "loggedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "neck", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "chest", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "waist", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "hip", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "rightArm", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "leftArm", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "forearm", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "thigh", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BodyMeasurement.prototype, "calf", void 0);
exports.BodyMeasurement = BodyMeasurement = __decorate([
    (0, mongoose_1.Schema)()
], BodyMeasurement);
exports.BodyMeasurementSchema = mongoose_1.SchemaFactory.createForClass(BodyMeasurement);
//# sourceMappingURL=body-measurement.schema.js.map