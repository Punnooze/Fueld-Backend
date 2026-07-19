import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { today } from '../common/date.util';
import { LogEntry, LogEntryDocument } from '../logs/schemas/log-entry.schema';
import {
  UserSettings,
  UserSettingsDocument,
} from '../settings/schemas/user-settings.schema';
import {
  WorkoutSession,
  WorkoutSessionDocument,
} from '../workouts/schemas/workout-session.schema';
import { XpService } from '../xp/xp.service';
import { PushService } from './push.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(LogEntry.name) private logModel: Model<LogEntryDocument>,
    @InjectModel(WorkoutSession.name)
    private workoutModel: Model<WorkoutSessionDocument>,
    @InjectModel(UserSettings.name)
    private settingsModel: Model<UserSettingsDocument>,
    private readonly xpService: XpService,
    private readonly push: PushService,
  ) {}

  // 10:30pm IST — brutal nightly reminder if the day's slipping
  @Cron('30 22 * * *', { timeZone: 'Asia/Kolkata' })
  async nightlyReminder() {
    const t = today();
    const settings = await this.settingsModel.findOne().exec();
    const proteinTarget = settings?.targetProtein ?? 140;

    const [proteinRows, gymCount, cardioDates] = await Promise.all([
      this.logModel
        .aggregate<{ protein: number }>([
          { $match: { date: t } },
          { $lookup: { from: 'fooditems', localField: 'foodItemId', foreignField: '_id', as: 'food' } },
          { $unwind: '$food' },
          { $group: { _id: null, protein: { $sum: { $multiply: ['$food.protein', '$quantity'] } } } },
        ])
        .exec(),
      this.workoutModel.countDocuments({ date: t }).exec(),
      this.xpService.datesForType('cardio'),
    ]);

    const protein = Math.round(proteinRows[0]?.protein ?? 0);
    const active = gymCount > 0 || cardioDates.includes(t) || protein > 0;
    const short = proteinTarget - protein;

    let title: string | null = null;
    let body: string | null = null;
    if (!active) {
      title = 'The day is almost gone';
      body = "Nothing logged. Don't let the streak die tonight.";
    } else if (short > 0) {
      title = `${protein}g protein logged`;
      body = `${short}g short. The muscle isn't building itself.`;
    }
    if (title && body) await this.push.notify(title, body, '/');
  }
}
