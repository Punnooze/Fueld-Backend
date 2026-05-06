import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsModule } from '../settings/settings.module';
import { WeightController } from './weight.controller';
import { WeightService } from './weight.service';
import { WeightLog, WeightLogSchema } from './schemas/weight-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WeightLog.name, schema: WeightLogSchema }]),
    SettingsModule,
  ],
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightModule {}
