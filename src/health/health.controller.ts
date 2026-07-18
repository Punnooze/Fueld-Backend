import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly config: ConfigService,
  ) {}

  @Get('auth')
  auth(@Res() res: Response) {
    res.redirect(this.healthService.authUrl());
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const frontend = this.config.get<string>('FRONTEND_URL') ?? '/';
    try {
      await this.healthService.exchangeCode(code);
      res.redirect(`${frontend}/?health=connected`);
    } catch (e) {
      res.status(400).send(
        `<body style="font-family:sans-serif;background:#0a0b0a;color:#f2f4ee;padding:40px">
          <h2>Google Health connection failed</h2>
          <p>${(e as Error).message}</p>
          <a style="color:#c8f135" href="${frontend}">Back to FUELD</a>
        </body>`,
      );
    }
  }

  @Get('today')
  today() {
    return this.healthService.today();
  }

  @Get('raw')
  raw(@Query('type') type: string) {
    return this.healthService.raw(type ?? 'steps');
  }
}
