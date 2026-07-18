import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsModule } from '../settings/settings.module';
import { WeightLog, WeightLogSchema } from '../weight/schemas/weight-log.schema';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [
    SettingsModule,
    MongooseModule.forFeature([{ name: WeightLog.name, schema: WeightLogSchema }]),
  ],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
