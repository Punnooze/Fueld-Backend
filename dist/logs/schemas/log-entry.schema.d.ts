import { HydratedDocument, Types } from 'mongoose';
export type LogEntryDocument = HydratedDocument<LogEntry>;
export declare class LogEntry {
    foodItemId: Types.ObjectId;
    quantity: number;
    note: string;
    date: string;
    loggedAt: Date;
}
export declare const LogEntrySchema: import("mongoose").Schema<LogEntry, import("mongoose").Model<LogEntry, any, any, any, any, any, LogEntry>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LogEntry, import("mongoose").Document<unknown, {}, LogEntry, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<LogEntry & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    foodItemId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, LogEntry, import("mongoose").Document<unknown, {}, LogEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LogEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, LogEntry, import("mongoose").Document<unknown, {}, LogEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LogEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string, LogEntry, import("mongoose").Document<unknown, {}, LogEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LogEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    date?: import("mongoose").SchemaDefinitionProperty<string, LogEntry, import("mongoose").Document<unknown, {}, LogEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LogEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    loggedAt?: import("mongoose").SchemaDefinitionProperty<Date, LogEntry, import("mongoose").Document<unknown, {}, LogEntry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<LogEntry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, LogEntry>;
