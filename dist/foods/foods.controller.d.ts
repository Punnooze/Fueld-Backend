import { CreateFoodDto } from './dto/create-food.dto';
import { FoodsService } from './foods.service';
export declare class FoodsController {
    private readonly foodsService;
    constructor(foodsService: FoodsService);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/food-item.schema").FoodItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/food-item.schema").FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(dto: CreateFoodDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/food-item.schema").FoodItem, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/food-item.schema").FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<void>;
}
