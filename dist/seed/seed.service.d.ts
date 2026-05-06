import { OnApplicationBootstrap } from '@nestjs/common';
import { Model } from 'mongoose';
import { FoodItemDocument } from '../foods/schemas/food-item.schema';
import { UserSettingsDocument } from '../settings/schemas/user-settings.schema';
export declare class SeedService implements OnApplicationBootstrap {
    private foodModel;
    private settingsModel;
    constructor(foodModel: Model<FoodItemDocument>, settingsModel: Model<UserSettingsDocument>);
    onApplicationBootstrap(): Promise<void>;
}
