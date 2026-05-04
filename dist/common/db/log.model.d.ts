import { Document } from 'mongoose';
export type LogDocument = Log & Document;
export declare class Log {
    email: string;
    lastLogin: Date;
}
export declare const LogSchema: import("mongoose").Schema<Log, import("mongoose").Model<Log, any, any, any, any, any, Log>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Log, Document<unknown, {}, Log, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    email?: import("mongoose").SchemaDefinitionProperty<string, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastLogin?: import("mongoose").SchemaDefinitionProperty<Date, Log, Document<unknown, {}, Log, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Log & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Log>;
