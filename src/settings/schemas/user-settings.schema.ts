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

  @Prop({ default: 'FIGHTER' })
  characterName!: string;

  @Prop()
  hevyApiKey?: string;

  @Prop()
  googleRefreshToken?: string;

  @Prop({ type: Object })
  pushSubscription?: Record<string, unknown>; // Web Push subscription object

  @Prop({ default: false })
  googleHealthConnected!: boolean;

  @Prop()
  fitbitRefreshToken?: string;

  @Prop({ default: false })
  fitbitConnected!: boolean;

  @Prop({ default: 10000 })
  stepTarget!: number;

  @Prop({ default: 8 })
  sleepTarget!: number;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettings);
