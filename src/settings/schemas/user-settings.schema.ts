import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserSettingsDocument = HydratedDocument<UserSettings>;

@Schema({ timestamps: { createdAt: false, updatedAt: true } })
export class UserSettings {
  @Prop({ default: 1700 })
  targetCalories!: number;

  @Prop({ default: 140 })
  targetProtein!: number;

  @Prop({ default: 180 })
  targetCarbs!: number;

  @Prop({ default: 55 })
  targetFat!: number;

  @Prop()
  height!: number;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
