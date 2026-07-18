import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestsService } from '../quests/quests.service';
import { SettingsService } from '../settings/settings.service';
import { XP } from '../xp/xp.constants';
import { XpService } from '../xp/xp.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { BodyMeasurement, BodyMeasurementDocument } from './schemas/body-measurement.schema';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectModel(BodyMeasurement.name)
    private measurementModel: Model<BodyMeasurementDocument>,
    private readonly settingsService: SettingsService,
    private readonly xpService: XpService,
    private readonly questsService: QuestsService,
  ) {}

  // US Navy method (men): 495 / (1.0324 - 0.19077*log10(waist-neck) + 0.15456*log10(height)) - 450
  private computeBodyFat(
    waist: number | undefined,
    neck: number | undefined,
    height: number | undefined,
  ): number | null {
    if (!waist || !neck || !height || waist <= neck) return null;
    const estimate =
      495 /
        (1.0324 -
          0.19077 * Math.log10(waist - neck) +
          0.15456 * Math.log10(height)) -
      450;
    return parseFloat(estimate.toFixed(1));
  }

  findAll(): Promise<BodyMeasurementDocument[]> {
    return this.measurementModel.find().sort({ date: -1 }).exec();
  }

  async findLatest() {
    const { height } = await this.settingsService.getSettings();
    const entry = await this.measurementModel.findOne().sort({ date: -1 }).exec();
    if (!entry) return null;
    const obj = entry.toObject();
    return {
      ...obj,
      bodyFatEstimate: this.computeBodyFat(obj.waist, obj.neck, height),
    };
  }

  async create(dto: CreateMeasurementDto) {
    // waist improvement vs most recent prior entry
    let waistImproved = false;
    if (dto.waist != null) {
      const prev = await this.measurementModel
        .findOne({ waist: { $ne: null } })
        .sort({ date: -1 })
        .exec();
      if (prev?.waist != null && dto.waist < prev.waist) waistImproved = true;
    }

    const entry = await this.measurementModel.create({
      ...dto,
      loggedAt: new Date(),
    });

    await this.xpService.award(
      'measurements',
      XP.MEASUREMENTS,
      'Logged body measurements',
      dto.date,
    );
    if (waistImproved)
      await this.xpService.award(
        'waist_improvement',
        XP.WAIST_IMPROVEMENT,
        'Waist measurement improved',
        dto.date,
      );

    const completedQuests = await this.questsService.evaluate();
    return { entry, completedQuests };
  }

  async update(id: string, dto: CreateMeasurementDto): Promise<BodyMeasurementDocument> {
    const entry = await this.measurementModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!entry) throw new NotFoundException('Measurement not found');
    return entry;
  }

  async remove(id: string): Promise<void> {
    const entry = await this.measurementModel.findById(id).exec();
    if (!entry) throw new NotFoundException('Measurement not found');
    await entry.deleteOne();
  }
}
