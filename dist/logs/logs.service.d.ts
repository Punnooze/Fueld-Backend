import { Model } from 'mongoose';
import { CreateLogDto } from './dto/create-log.dto';
import { LogEntryDocument } from './schemas/log-entry.schema';
export declare class LogsService {
    private logModel;
    constructor(logModel: Model<LogEntryDocument>);
    findByDate(date: string): Promise<LogEntryDocument[]>;
    findWeek(startDate: string): Promise<Record<string, LogEntryDocument[]>>;
    findHistory(startDate: string, endDate: string): Promise<Record<string, LogEntryDocument[]>>;
    create(dto: CreateLogDto): Promise<LogEntryDocument>;
    remove(id: string): Promise<void>;
}
