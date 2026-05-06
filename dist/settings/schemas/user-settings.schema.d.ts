import { HydratedDocument } from 'mongoose';
export type UserSettingsDocument = HydratedDocument<UserSettings>;
export declare class UserSettings {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    height: number;
}
export declare const UserSettingsSchema: import("mongoose").Schema<UserSettings, import("mongoose").Model<UserSettings, any, any, any, any, any, UserSettings>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserSettings, import("mongoose").Document<unknown, {}, UserSettings, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UserSettings & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    targetCalories?: import("mongoose").SchemaDefinitionProperty<number, UserSettings, import("mongoose").Document<unknown, {}, UserSettings, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetProtein?: import("mongoose").SchemaDefinitionProperty<number, UserSettings, import("mongoose").Document<unknown, {}, UserSettings, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetCarbs?: import("mongoose").SchemaDefinitionProperty<number, UserSettings, import("mongoose").Document<unknown, {}, UserSettings, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    targetFat?: import("mongoose").SchemaDefinitionProperty<number, UserSettings, import("mongoose").Document<unknown, {}, UserSettings, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    height?: import("mongoose").SchemaDefinitionProperty<number, UserSettings, import("mongoose").Document<unknown, {}, UserSettings, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserSettings & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, UserSettings>;
