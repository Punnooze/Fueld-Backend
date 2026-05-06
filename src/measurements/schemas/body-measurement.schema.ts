import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BodyMeasurementDocument = HydratedDocument<BodyMeasurement>;

@Schema()
export class BodyMeasurement {
  @Prop({ required: true })
  date!: string;

  @Prop({ default: () => new Date() })
  loggedAt!: Date;

  @Prop()
  neck?: number;

  @Prop()
  chest?: number;

  @Prop()
  waist?: number;

  @Prop()
  hip?: number;

  @Prop()
  rightArm?: number;

  @Prop()
  leftArm?: number;

  @Prop()
  forearm?: number;

  @Prop()
  thigh?: number;

  @Prop()
  calf?: number;
}

export const BodyMeasurementSchema = SchemaFactory.createForClass(BodyMeasurement);
