import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsService } from '../settings/settings.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { WeightLog, WeightLogDocument } from './schemas/weight-log.schema';

@Injectable()
export class WeightService {
  constructor(
    @InjectModel(WeightLog.name) private weightModel: Model<WeightLogDocument>,
    private readonly settingsService: SettingsService,
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

  create(dto: CreateWeightDto): Promise<WeightLogDocument> {
    return this.weightModel.create({ ...dto, loggedAt: new Date() });
  }

  async remove(id: string): Promise<void> {
    const entry = await this.weightModel.findById(id).exec();
    if (!entry) throw new NotFoundException('Weight entry not found');
    await entry.deleteOne();
  }
}
