import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestDocument = HydratedDocument<Quest>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Quest {
  @Prop({ required: true })
  type: string; // 'daily'|'weekly'|'boss'

  @Prop({ required: true })
  key: string; // stable definition key e.g. 'fuel_up'

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  xpReward: number;

  @Prop({ required: true, default: 1 })
  targetValue: number;

  @Prop({ default: 0 })
  currentValue: number;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt: Date;

  @Prop({ required: true })
  periodKey: string; // groups a quest to its period, e.g. daily='2026-07-18', weekly='2026-W29', boss='boss'

  @Prop()
  expiresAt: Date;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
// one quest doc per (key, periodKey)
QuestSchema.index({ key: 1, periodKey: 1 }, { unique: true });
