import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeightLogDocument = HydratedDocument<WeightLog>;

@Schema()
export class WeightLog {
  @Prop({ required: true })
  weight!: number;

  @Prop({ required: true })
  date!: string;

  @Prop({ default: () => new Date() })
  loggedAt!: Date;
}

export const WeightLogSchema = SchemaFactory.createForClass(WeightLog);
