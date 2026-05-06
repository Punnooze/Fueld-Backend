import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLogDto } from './dto/create-log.dto';
import { LogEntry, LogEntryDocument } from './schemas/log-entry.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(LogEntry.name) private logModel: Model<LogEntryDocument>,
  ) {}

  findByDate(date: string): Promise<LogEntryDocument[]> {
    return this.logModel
      .find({ date })
      .populate('foodItemId')
      .sort({ loggedAt: 1 })
      .exec();
  }

  async findWeek(
    startDate: string,
  ): Promise<Record<string, LogEntryDocument[]>> {
    const dates: string[] = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const entries = await this.logModel
      .find({ date: { $in: dates } })
      .populate('foodItemId')
      .sort({ loggedAt: 1 })
      .exec();

    const grouped: Record<string, LogEntryDocument[]> = {};
    for (const date of dates) grouped[date] = [];
    for (const entry of entries) grouped[entry.date].push(entry);

    return grouped;
  }

  async findHistory(
    startDate: string,
    endDate: string,
  ): Promise<Record<string, LogEntryDocument[]>> {
    const entries = await this.logModel
      .find({ date: { $gte: startDate, $lte: endDate } })
      .populate('foodItemId')
      .sort({ date: 1, loggedAt: 1 })
      .exec();

    const grouped: Record<string, LogEntryDocument[]> = {};
    for (const entry of entries) {
      if (!grouped[entry.date]) grouped[entry.date] = [];
      grouped[entry.date].push(entry);
    }
    return grouped;
  }

  create(dto: CreateLogDto): Promise<LogEntryDocument> {
    return this.logModel.create({
      foodItemId: new Types.ObjectId(dto.foodItemId),
      quantity: dto.quantity,
      date: dto.date,
      note: dto.note,
      loggedAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    const entry = await this.logModel.findById(id).exec();
    if (!entry) throw new NotFoundException('Log entry not found');
    await entry.deleteOne();
  }
}
