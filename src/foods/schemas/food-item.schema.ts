import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FoodItemDocument = HydratedDocument<FoodItem>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class FoodItem {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  calories!: number;

  @Prop({ required: true })
  protein!: number;

  @Prop({ required: true })
  carbs!: number;

  @Prop({ required: true })
  fat!: number;

  @Prop({ default: false })
  isCustom!: boolean;
}

export const FoodItemSchema = SchemaFactory.createForClass(FoodItem);
