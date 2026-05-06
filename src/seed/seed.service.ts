import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FoodItem, FoodItemDocument } from '../foods/schemas/food-item.schema';
import { UserSettings, UserSettingsDocument } from '../settings/schemas/user-settings.schema';

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

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(FoodItem.name) private foodModel: Model<FoodItemDocument>,
    @InjectModel(UserSettings.name)
    private settingsModel: Model<UserSettingsDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.foodModel.countDocuments();
    if (count === 0) {
      await this.foodModel.insertMany(
        SEED_FOODS.map((f) => ({ ...f, isCustom: false })),
      );
      console.log(`Seeded ${SEED_FOODS.length} food items`);
    }

    const settingsCount = await this.settingsModel.countDocuments();
    if (settingsCount === 0) {
      await this.settingsModel.create({});
      console.log('Seeded default user settings');
    }
  }
}
