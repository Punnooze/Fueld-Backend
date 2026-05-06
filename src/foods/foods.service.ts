import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodItem, FoodItemDocument } from './schemas/food-item.schema';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(FoodItem.name) private foodModel: Model<FoodItemDocument>,
  ) {}

  findAll(): Promise<FoodItemDocument[]> {
    return this.foodModel.find().sort({ createdAt: 1 }).exec();
  }

  create(dto: CreateFoodDto): Promise<FoodItemDocument> {
    return this.foodModel.create({ ...dto, isCustom: true });
  }

  async remove(id: string): Promise<void> {
    const item = await this.foodModel.findById(id).exec();
    if (!item) throw new NotFoundException('Food item not found');
    if (!item.isCustom)
      throw new BadRequestException('Cannot delete preloaded food items');
    await item.deleteOne();
  }
}
