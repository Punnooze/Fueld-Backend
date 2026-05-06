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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const food_item_schema_1 = require("../foods/schemas/food-item.schema");
const user_settings_schema_1 = require("../settings/schemas/user-settings.schema");
const SEED_FOODS = [
    {
        name: 'Overnight Oats with Whey',
        calories: 420,
        protein: 30,
        carbs: 52,
        fat: 9,
    },
    {
        name: 'Canteen Thaali 3 Roti',
        calories: 600,
        protein: 38,
        carbs: 85,
        fat: 14,
    },
    { name: 'Whey Protein Shake', calories: 120, protein: 25, carbs: 4, fat: 1 },
    { name: 'Chicken Breast 200g', calories: 220, protein: 44, carbs: 0, fat: 5 },
    { name: 'Whole Egg', calories: 70, protein: 6, carbs: 0, fat: 5 },
    {
        name: 'Seekh Kabab (per piece)',
        calories: 102,
        protein: 9,
        carbs: 4,
        fat: 6,
    },
    { name: 'Protein Chips 40g', calories: 167, protein: 10, carbs: 18, fat: 6 },
    {
        name: 'Protein Ice Cream 100ml',
        calories: 116,
        protein: 8,
        carbs: 14,
        fat: 3,
    },
    { name: 'Banana', calories: 90, protein: 1, carbs: 23, fat: 0 },
    { name: 'Black Coffee', calories: 5, protein: 0, carbs: 1, fat: 0 },
];
let SeedService = class SeedService {
    foodModel;
    settingsModel;
    constructor(foodModel, settingsModel) {
        this.foodModel = foodModel;
        this.settingsModel = settingsModel;
    }
    async onApplicationBootstrap() {
        const count = await this.foodModel.countDocuments();
        if (count === 0) {
            await this.foodModel.insertMany(SEED_FOODS.map((f) => ({ ...f, isCustom: false })));
            console.log(`Seeded ${SEED_FOODS.length} food items`);
        }
        const settingsCount = await this.settingsModel.countDocuments();
        if (settingsCount === 0) {
            await this.settingsModel.create({});
            console.log('Seeded default user settings');
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(food_item_schema_1.FoodItem.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_settings_schema_1.UserSettings.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map