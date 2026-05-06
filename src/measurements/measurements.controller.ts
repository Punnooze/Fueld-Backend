import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { MeasurementsService } from './measurements.service';

@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Get('latest')
  findLatest() {
    return this.measurementsService.findLatest();
  }

  @Get()
  findAll() {
    return this.measurementsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMeasurementDto) {
    return this.measurementsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateMeasurementDto) {
    return this.measurementsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.measurementsService.remove(id);
  }
}
