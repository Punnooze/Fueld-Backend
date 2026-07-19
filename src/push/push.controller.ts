import { Body, Controller, Get, Post } from '@nestjs/common';
import { PushService } from './push.service';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('publicKey')
  publicKey() {
    return { key: this.pushService.publicKey() };
  }

  @Post('subscribe')
  subscribe(@Body() sub: Record<string, unknown>) {
    return this.pushService.subscribe(sub);
  }

  @Post('test')
  test() {
    return this.pushService.test();
  }
}
