import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { UserSettingsDocument } from './schemas/user-settings.schema';
export declare class SettingsService {
    private settingsModel;
    constructor(settingsModel: Model<UserSettingsDocument>);
    getSettings(): Promise<UserSettingsDocument>;
    update(dto: UpdateSettingsDto): Promise<UserSettingsDocument>;
}
