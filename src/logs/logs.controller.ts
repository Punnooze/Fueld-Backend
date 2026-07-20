import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findByDate(@Query('date') date: string) {
    return this.logsService.findByDate(date);
  }

  @Get('week')
  findWeek(@Query('startDate') startDate: string) {
    return this.logsService.findWeek(startDate);
  }

  @Get('history')
  findHistory(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.logsService.findHistory(startDate, endDate);
  }

  @Post()
  create(@Body() dto: CreateLogDto) {
    return this.logsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLogDto) {
    return this.logsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logsService.remove(id);
  }
}
