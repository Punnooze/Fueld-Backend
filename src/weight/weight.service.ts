import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestsService } from '../quests/quests.service';
import { SettingsService } from '../settings/settings.service';
import { XP } from '../xp/xp.constants';
import { XpService } from '../xp/xp.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { WeightLog, WeightLogDocument } from './schemas/weight-log.schema';

@Injectable()
export class WeightService {
  constructor(
    @InjectModel(WeightLog.name) private weightModel: Model<WeightLogDocument>,
    private readonly settingsService: SettingsService,
    private readonly xpService: XpService,
    private readonly questsService: QuestsService,
  ) {}

  private computeBmi(weight: number, height: number | undefined): number | null {
    if (!height) return null;
    return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(1));
  }

  async findInRange(startDate: string, endDate: string) {
    const { height } = await this.settingsService.getSettings();
    const entries = await this.weightModel
      .find({ date: { $gte: startDate, $lte: endDate } })
      .sort({ date: 1 })
      .exec();
    return entries.map((e) => ({ ...e.toObject(), bmi: this.computeBmi(e.weight, height) }));
  }

  async findLatest() {
    const { height } = await this.settingsService.getSettings();
    const entry = await this.weightModel.findOne().sort({ date: -1 }).exec();
    if (!entry) return null;
    return { ...entry.toObject(), bmi: this.computeBmi(entry.weight, height) };
  }

  async create(dto: CreateWeightDto) {
    const entry = await this.weightModel.create({
      ...dto,
      loggedAt: new Date(),
    });
    await this.xpService.award('weight', XP.WEIGHT, 'Logged weight', dto.date);
    await this.awardJourneyProgress(dto.date);
    const completedQuests = await this.questsService.evaluate();
    return { entry, completedQuests };
  }

  /** Compute the goal-weight journey from all logged weights. Null if no goal set. */
  async journey() {
    const { goalWeight } = await this.settingsService.getSettings();
    if (!goalWeight) return null;
    const all = await this.weightModel.find().sort({ date: 1 }).exec();
    if (all.length === 0) return null;

    const start = all[0].weight;
    const current = all[all.length - 1].weight;
    const losing = start > goalWeight;
    const total = Math.abs(start - goalWeight);
    if (total < 0.1) return null;

    const weights = all.map((w) => w.weight);
    const best = losing ? Math.min(...weights) : Math.max(...weights);
    const clamp = (v: number) => Math.max(0, Math.min(v, total));
    const bestProgress = clamp(losing ? start - best : best - start);
    const curProgress = clamp(losing ? start - current : current - start);
    const r1 = (n: number) => Math.round(n * 10) / 10;

    return {
      goalWeight,
      startWeight: r1(start),
      currentWeight: r1(current),
      losing,
      totalKg: r1(total),
      achievedKg: r1(curProgress), // progress at current weight
      bestKg: r1(bestProgress), // best (banked) progress = milestone XP earned
      remainingKg: r1(losing ? current - goalWeight : goalWeight - current),
      pct: Math.round((curProgress / total) * 100),
      reached: losing ? best <= goalWeight : best >= goalWeight,
    };
  }

  /** Award 1 milestone/kg of banked progress + a one-time bonus at goal. Idempotent. */
  private async awardJourneyProgress(date: string) {
    const j = await this.journey();
    if (!j) return;
    const milestones = Math.floor(j.bestKg);
    const earned = await this.xpService.countByType('weight_milestone');
    for (let k = earned + 1; k <= milestones; k++) {
      await this.xpService.award(
        'weight_milestone',
        XP.WEIGHT_MILESTONE,
        `${k}kg toward goal`,
        date,
      );
    }
    if (j.reached && (await this.xpService.countByType('weight_goal')) === 0) {
      await this.xpService.award('weight_goal', XP.GOAL_REACHED, 'Goal weight reached!', date);
    }
  }

  async remove(id: string): Promise<void> {
    const entry = await this.weightModel.findById(id).exec();
    if (!entry) throw new NotFoundException('Weight entry not found');
    await entry.deleteOne();
  }
}
