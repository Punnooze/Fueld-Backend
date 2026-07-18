import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DAILY_ONCE_TYPES } from './xp.constants';
import { XPEvent, XPEventDocument } from './schemas/xp-event.schema';

@Injectable()
export class XpService {
  constructor(
    @InjectModel(XPEvent.name) private xpModel: Model<XPEventDocument>,
  ) {}

  /**
   * Award XP. Daily-once event types (protein_target, calorie_target, weight,
   * measurements) can only fire once per date — returns null if already fired.
   */
  async award(
    type: string,
    xp: number,
    description: string,
    date: string,
  ): Promise<XPEventDocument | null> {
    if (DAILY_ONCE_TYPES.has(type)) {
      const exists = await this.xpModel.exists({ type, date });
      if (exists) return null;
    }
    return this.xpModel.create({
      type,
      xp,
      description,
      date,
      loggedAt: new Date(),
    });
  }

  async totalXp(): Promise<number> {
    const res = await this.xpModel
      .aggregate<{ total: number }>([
        { $group: { _id: null, total: { $sum: '$xp' } } },
      ])
      .exec();
    return res[0]?.total ?? 0;
  }

  recent(limit = 20): Promise<XPEventDocument[]> {
    return this.xpModel.find().sort({ loggedAt: -1 }).limit(limit).exec();
  }
}
