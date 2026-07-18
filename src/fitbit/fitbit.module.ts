import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { FitbitController } from './fitbit.controller';
import { FitbitService } from './fitbit.service';

@Module({
  imports: [SettingsModule],
  controllers: [FitbitController],
  providers: [FitbitService],
})
export class FitbitModule {}
