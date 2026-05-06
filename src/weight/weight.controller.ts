import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateWeightDto } from './dto/create-weight.dto';
import { WeightService } from './weight.service';

@Controller('weight')
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Get('latest')
  findLatest() {
    return this.weightService.findLatest();
  }

  @Get()
  findInRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.weightService.findInRange(startDate, endDate);
  }

  @Post()
  create(@Body() dto: CreateWeightDto) {
    return this.weightService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weightService.remove(id);
  }
}
