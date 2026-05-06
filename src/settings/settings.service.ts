import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UserSettings, UserSettingsDocument } from './schemas/user-settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(UserSettings.name)
    private settingsModel: Model<UserSettingsDocument>,
  ) {}

  async getSettings(): Promise<UserSettingsDocument> {
    const settings = await this.settingsModel.findOne().exec();
    if (settings) return settings;
    return this.settingsModel.create({});
  }

  async update(dto: UpdateSettingsDto): Promise<UserSettingsDocument> {
    const result = await this.settingsModel
      .findOneAndUpdate({}, { $set: dto }, { upsert: true, new: true })
      .exec();
    return result!;
  }
}
