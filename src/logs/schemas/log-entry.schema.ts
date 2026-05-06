import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FoodItem } from '../../foods/schemas/food-item.schema';

export type LogEntryDocument = HydratedDocument<LogEntry>;

@Schema()
export class LogEntry {
  @Prop({ type: Types.ObjectId, ref: FoodItem.name, required: true })
  foodItemId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  note: string;

  @Prop({ required: true })
  date: string;

  @Prop({ default: () => new Date() })
  loggedAt: Date;
}

export const LogEntrySchema = SchemaFactory.createForClass(LogEntry);
