import { Controller, Get, Post, Query } from '@nestjs/common';
import { HevyService } from './hevy.service';

@Controller('hevy')
export class HevyController {
  constructor(private readonly hevyService: HevyService) {}

  @Post('sync')
  sync() {
    return this.hevyService.sync();
  }

  @Get('stats')
  stats(@Query('days') days?: string) {
    return this.hevyService.stats(days ? parseInt(days, 10) : 90);
  }
}
