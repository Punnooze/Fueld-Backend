import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsService } from '../settings/settings.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { BodyMeasurement, BodyMeasurementDocument } from './schemas/body-measurement.schema';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectModel(BodyMeasurement.name)
    private measurementModel: Model<BodyMeasurementDocument>,
    private readonly settingsService: SettingsService,
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

  create(dto: CreateMeasurementDto): Promise<BodyMeasurementDocument> {
    return this.measurementModel.create({ ...dto, loggedAt: new Date() });
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
