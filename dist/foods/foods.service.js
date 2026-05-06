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
exports.FoodsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const food_item_schema_1 = require("./schemas/food-item.schema");
let FoodsService = class FoodsService {
    foodModel;
    constructor(foodModel) {
        this.foodModel = foodModel;
    }
    findAll() {
        return this.foodModel.find().sort({ createdAt: 1 }).exec();
    }
    create(dto) {
        return this.foodModel.create({ ...dto, isCustom: true });
    }
    async remove(id) {
        const item = await this.foodModel.findById(id).exec();
        if (!item)
            throw new common_1.NotFoundException('Food item not found');
        if (!item.isCustom)
            throw new common_1.BadRequestException('Cannot delete preloaded food items');
        await item.deleteOne();
    }
};
exports.FoodsService = FoodsService;
exports.FoodsService = FoodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(food_item_schema_1.FoodItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FoodsService);
//# sourceMappingURL=foods.service.js.map