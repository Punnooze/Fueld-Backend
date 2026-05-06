import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsModule } from '../settings/settings.module';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsService } from './measurements.service';
import { BodyMeasurement, BodyMeasurementSchema } from './schemas/body-measurement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BodyMeasurement.name, schema: BodyMeasurementSchema },
    ]),
    SettingsModule,
  ],
  controllers: [MeasurementsController],
  providers: [MeasurementsService],
})
export class MeasurementsModule {}
