import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEntry, LogEntrySchema } from '../logs/schemas/log-entry.schema';
import {
  BodyMeasurement,
  BodyMeasurementSchema,
} from '../measurements/schemas/body-measurement.schema';
import {
  UserSettings,
  UserSettingsSchema,
} from '../settings/schemas/user-settings.schema';
import { WeightLog, WeightLogSchema } from '../weight/schemas/weight-log.schema';
import {
  WorkoutSession,
  WorkoutSessionSchema,
} from '../workouts/schemas/workout-session.schema';
import { XpModule } from '../xp/xp.module';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';

@Module({
  imports: [
    XpModule,
    MongooseModule.forFeature([
      { name: LogEntry.name, schema: LogEntrySchema },
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
      { name: WeightLog.name, schema: WeightLogSchema },
      { name: BodyMeasurement.name, schema: BodyMeasurementSchema },
      { name: UserSettings.name, schema: UserSettingsSchema },
    ]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
