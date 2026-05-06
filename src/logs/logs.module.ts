import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LogEntry, LogEntrySchema } from './schemas/log-entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogEntry.name, schema: LogEntrySchema },
    ]),
  ],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
