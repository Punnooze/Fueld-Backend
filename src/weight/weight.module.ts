import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsModule } from '../quests/quests.module';
import { SettingsModule } from '../settings/settings.module';
import { XpModule } from '../xp/xp.module';
import { WeightController } from './weight.controller';
import { WeightService } from './weight.service';
import { WeightLog, WeightLogSchema } from './schemas/weight-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WeightLog.name, schema: WeightLogSchema }]),
    SettingsModule,
    XpModule,
    QuestsModule,
  ],
  controllers: [WeightController],
  providers: [WeightService],
})
export class WeightModule {}
