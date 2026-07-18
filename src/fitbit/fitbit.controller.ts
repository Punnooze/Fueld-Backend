import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { FitbitService } from './fitbit.service';

@Controller('fitbit')
export class FitbitController {
  constructor(
    private readonly fitbitService: FitbitService,
    private readonly config: ConfigService,
  ) {}

  @Get('auth')
  auth(@Res() res: Response) {
    res.redirect(this.fitbitService.authUrl());
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const frontend = this.config.get<string>('FRONTEND_URL') ?? '/';
    try {
      await this.fitbitService.exchangeCode(code);
      res.redirect(`${frontend}/?fitbit=connected`);
    } catch (e) {
      res.status(400).send(
        `<body style="font-family:sans-serif;background:#0a0b0a;color:#f2f4ee;padding:40px">
          <h2>Fitbit connection failed</h2><p>${(e as Error).message}</p>
          <a style="color:#c8f135" href="${frontend}">Back to FUELD</a>
        </body>`,
      );
    }
  }

  @Get('today')
  today() {
    return this.fitbitService.today();
  }
}
