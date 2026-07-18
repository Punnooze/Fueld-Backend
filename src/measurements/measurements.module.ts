import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsModule } from '../quests/quests.module';
import { SettingsModule } from '../settings/settings.module';
import { XpModule } from '../xp/xp.module';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { BodyMeasurement, BodyMeasurementSchema } from './schemas/body-measurement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BodyMeasurement.name, schema: BodyMeasurementSchema },
    ]),
    SettingsModule,
    XpModule,
    QuestsModule,
  ],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}
