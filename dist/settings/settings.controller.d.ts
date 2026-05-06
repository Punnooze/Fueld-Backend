import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user-settings.schema").UserSettings, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user-settings.schema").UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(dto: UpdateSettingsDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user-settings.schema").UserSettings, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user-settings.schema").UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
}
