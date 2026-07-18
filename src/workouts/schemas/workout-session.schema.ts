import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WorkoutSessionDocument = HydratedDocument<WorkoutSession>;

@Schema()
export class WorkoutSession {
  @Prop({ required: true })
  type: string; // 'Push'|'Pull'|'Legs'|'Full Body'|'Cardio'|'Other'

  @Prop()
  duration: number; // minutes

  @Prop({ required: true, default: 'Medium' })
  intensity: string; // 'Easy'|'Medium'|'Hard'|'Destroyed'

  @Prop()
  note: string;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ default: () => new Date() })
  loggedAt: Date;

  @Prop({ default: 0 })
  xpEarned: number;

  @Prop({ index: true, sparse: true })
  hevyWorkoutId: string; // dedup for Hevy imports

  @Prop({ default: 0 })
  totalVolume: number; // kg

  @Prop({ type: [String], default: [] })
  exercises: string[];

  @Prop({ type: [String], default: [] })
  prs: string[]; // exercises where a PR was hit
}

export const WorkoutSessionSchema =
  SchemaFactory.createForClass(WorkoutSession);
