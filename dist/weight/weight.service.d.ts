import { Model } from 'mongoose';
import { SettingsService } from '../settings/settings.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { WeightLogDocument } from './schemas/weight-log.schema';
export declare class WeightService {
    private weightModel;
    private readonly settingsService;
    constructor(weightModel: Model<WeightLogDocument>, settingsService: SettingsService);
    private computeBmi;
    findInRange(startDate: string, endDate: string): Promise<{
        bmi: number | null;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        weight: number;
        date: string;
        loggedAt: Date;
        __v: number;
        id: string;
    }[]>;
    findLatest(): Promise<{
        bmi: number | null;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        weight: number;
        date: string;
        loggedAt: Date;
        __v: number;
        id: string;
    } | null>;
    create(dto: CreateWeightDto): Promise<WeightLogDocument>;
    remove(id: string): Promise<void>;
}
