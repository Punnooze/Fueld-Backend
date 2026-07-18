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

  async setGoogleTokens(refreshToken: string): Promise<void> {
    await this.settingsModel
      .findOneAndUpdate(
        {},
        { $set: { googleRefreshToken: refreshToken, googleHealthConnected: true } },
        { upsert: true },
      )
      .exec();
  }

  async getGoogleRefreshToken(): Promise<string | undefined> {
    const s = await this.settingsModel.findOne().exec();
    return s?.googleRefreshToken;
  }

  async setFitbitTokens(refreshToken: string): Promise<void> {
    await this.settingsModel
      .findOneAndUpdate(
        {},
        { $set: { fitbitRefreshToken: refreshToken, fitbitConnected: true } },
        { upsert: true },
      )
      .exec();
  }

  async getFitbitRefreshToken(): Promise<string | undefined> {
    const s = await this.settingsModel.findOne().exec();
    return s?.fitbitRefreshToken;
  }
}
