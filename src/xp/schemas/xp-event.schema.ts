import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type XPEventDocument = HydratedDocument<XPEvent>;

@Schema()
export class XPEvent {
  @Prop({ required: true })
  type: string; // event key e.g. 'gym_session', 'protein_target', 'pr'

  @Prop({ required: true })
  xp: number;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ default: () => new Date() })
  loggedAt: Date;
}

export const XPEventSchema = SchemaFactory.createForClass(XPEvent);
