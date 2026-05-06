import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { MeasurementsService } from './measurements.service';
export declare class MeasurementsController {
    private readonly measurementsService;
    constructor(measurementsService: MeasurementsService);
    findLatest(): Promise<{
        bodyFatEstimate: number | null;
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
        date: string;
        loggedAt: Date;
        neck?: number;
        chest?: number;
        waist?: number;
        hip?: number;
        rightArm?: number;
        leftArm?: number;
        forearm?: number;
        thigh?: number;
        calf?: number;
        __v: number;
        id: string;
    } | null>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/body-measurement.schema").BodyMeasurement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/body-measurement.schema").BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(dto: CreateMeasurementDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/body-measurement.schema").BodyMeasurement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/body-measurement.schema").BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: CreateMeasurementDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/body-measurement.schema").BodyMeasurement, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/body-measurement.schema").BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<void>;
}
