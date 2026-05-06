import { HydratedDocument } from 'mongoose';
export type WeightLogDocument = HydratedDocument<WeightLog>;
export declare class WeightLog {
    weight: number;
    date: string;
    loggedAt: Date;
}
export declare const WeightLogSchema: import("mongoose").Schema<WeightLog, import("mongoose").Model<WeightLog, any, any, any, any, any, WeightLog>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeightLog, import("mongoose").Document<unknown, {}, WeightLog, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<WeightLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    weight?: import("mongoose").SchemaDefinitionProperty<number, WeightLog, import("mongoose").Document<unknown, {}, WeightLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeightLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, WeightLog, import("mongoose").Document<unknown, {}, WeightLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeightLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    loggedAt?: import("mongoose").SchemaDefinitionProperty<Date, WeightLog, import("mongoose").Document<unknown, {}, WeightLog, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<WeightLog & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, WeightLog>;
