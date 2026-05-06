import { CreateWeightDto } from './dto/create-weight.dto';
import { WeightService } from './weight.service';
export declare class WeightController {
    private readonly weightService;
    constructor(weightService: WeightService);
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
    create(dto: CreateWeightDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/weight-log.schema").WeightLog, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/weight-log.schema").WeightLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<void>;
}
