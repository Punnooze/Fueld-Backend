import { HydratedDocument } from 'mongoose';
export type BodyMeasurementDocument = HydratedDocument<BodyMeasurement>;
export declare class BodyMeasurement {
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
}
export declare const BodyMeasurementSchema: import("mongoose").Schema<BodyMeasurement, import("mongoose").Model<BodyMeasurement, any, any, any, any, any, BodyMeasurement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<string, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    loggedAt?: import("mongoose").SchemaDefinitionProperty<Date, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    neck?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    chest?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    waist?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hip?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rightArm?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    leftArm?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    forearm?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    thigh?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    calf?: import("mongoose").SchemaDefinitionProperty<number | undefined, BodyMeasurement, import("mongoose").Document<unknown, {}, BodyMeasurement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<BodyMeasurement & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, BodyMeasurement>;
