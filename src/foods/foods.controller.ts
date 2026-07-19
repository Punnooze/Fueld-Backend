import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  findAll() {
    return this.foodsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foodsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: CreateFoodDto) {
    return this.foodsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foodsService.remove(id);
  }
}
