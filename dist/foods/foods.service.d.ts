import { Model } from 'mongoose';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodItemDocument } from './schemas/food-item.schema';
export declare class FoodsService {
    private foodModel;
    constructor(foodModel: Model<FoodItemDocument>);
    findAll(): Promise<FoodItemDocument[]>;
    create(dto: CreateFoodDto): Promise<FoodItemDocument>;
    remove(id: string): Promise<void>;
}
