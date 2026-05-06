import { CreateLogDto } from './dto/create-log.dto';
import { LogsService } from './logs.service';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    findByDate(date: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/log-entry.schema").LogEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/log-entry.schema").LogEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findWeek(startDate: string): Promise<Record<string, (import("mongoose").Document<unknown, {}, import("./schemas/log-entry.schema").LogEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/log-entry.schema").LogEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>>;
    findHistory(startDate: string, endDate: string): Promise<Record<string, (import("mongoose").Document<unknown, {}, import("./schemas/log-entry.schema").LogEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/log-entry.schema").LogEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>>;
    create(dto: CreateLogDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/log-entry.schema").LogEntry, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/log-entry.schema").LogEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string): Promise<void>;
}
