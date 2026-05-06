import { HydratedDocument } from 'mongoose';
export type FoodItemDocument = HydratedDocument<FoodItem>;
export declare class FoodItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    isCustom: boolean;
}
export declare const FoodItemSchema: import("mongoose").Schema<FoodItem, import("mongoose").Model<FoodItem, any, any, any, any, any, FoodItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    calories?: import("mongoose").SchemaDefinitionProperty<number, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    protein?: import("mongoose").SchemaDefinitionProperty<number, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    carbs?: import("mongoose").SchemaDefinitionProperty<number, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    fat?: import("mongoose").SchemaDefinitionProperty<number, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isCustom?: import("mongoose").SchemaDefinitionProperty<boolean, FoodItem, import("mongoose").Document<unknown, {}, FoodItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<FoodItem & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, FoodItem>;
