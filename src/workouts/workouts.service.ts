import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestsService } from '../quests/quests.service';
import { XP, volumeMultiplier } from '../xp/xp.constants';
import { XpService } from '../xp/xp.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import {
  WorkoutSession,
  WorkoutSessionDocument,
} from './schemas/workout-session.schema';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(WorkoutSession.name)
    private workoutModel: Model<WorkoutSessionDocument>,
    private readonly xpService: XpService,
    private readonly questsService: QuestsService,
  ) {}

  /** XP for a session: (base + intensity bonus) × volume multiplier + PRs. */
  computeXp(intensity: string, totalVolume = 0, prs: string[] = []): number {
    let base = XP.GYM_SESSION;
    if (intensity === 'Hard' || intensity === 'Destroyed')
      base += XP.GYM_INTENSITY_BONUS;
    const withVolume = Math.round(base * volumeMultiplier(totalVolume));
    return withVolume + prs.length * XP.PR;
  }

  findRange(startDate?: string, endDate?: string) {
    const q: Record<string, unknown> = {};
    if (startDate && endDate) q.date = { $gte: startDate, $lte: endDate };
    return this.workoutModel.find(q).sort({ date: -1, loggedAt: -1 }).exec();
  }

  findRecent(limit = 10) {
    return this.workoutModel
      .find()
      .sort({ date: -1, loggedAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(dto: CreateWorkoutDto) {
    const intensity = dto.intensity ?? 'Medium';
    const xpEarned = this.computeXp(intensity);
    const workout = await this.workoutModel.create({
      type: dto.type,
      duration: dto.duration,
      intensity,
      note: dto.note,
      date: dto.date,
      loggedAt: new Date(),
      xpEarned,
    });
    await this.xpService.award(
      'gym_session',
      xpEarned,
      `${dto.type} session (${intensity})`,
      dto.date,
    );
    const completedQuests = await this.questsService.evaluate();
    return { workout, xpEarned, completedQuests };
  }

  async remove(id: string): Promise<void> {
    const entry = await this.workoutModel.findById(id).exec();
    if (!entry) throw new NotFoundException('Workout not found');
    await entry.deleteOne();
  }
}
