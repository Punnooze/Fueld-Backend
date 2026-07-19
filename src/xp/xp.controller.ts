import { Controller, Get, Query } from '@nestjs/common';
import { XpService } from './xp.service';

@Controller('xp')
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Get()
  recent(@Query('limit') limit?: string) {
    return this.xpService.recent(limit ? parseInt(limit, 10) : 20);
  }

  @Get('dates')
  dates(@Query('type') type?: string) {
    return this.xpService.datesForType(type ?? 'cardio');
  }
}
