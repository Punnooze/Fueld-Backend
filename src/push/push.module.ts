import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogEntry, LogEntrySchema } from '../logs/schemas/log-entry.schema';
import { SettingsModule } from '../settings/settings.module';
import {
  WorkoutSession,
  WorkoutSessionSchema,
} from '../workouts/schemas/workout-session.schema';
import { XpModule } from '../xp/xp.module';
import { NotificationsService } from './notifications.service';
import { PushController } from './push.controller';
import { PushService } from './push.service';

@Module({
  imports: [
    SettingsModule,
    XpModule,
    MongooseModule.forFeature([
      { name: LogEntry.name, schema: LogEntrySchema },
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
    ]),
  ],
  controllers: [PushController],
  providers: [PushService, NotificationsService],
  exports: [PushService],
})
export class PushModule {}
