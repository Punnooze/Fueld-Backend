import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodsModule } from './foods/foods.module';
import { LogsModule } from './logs/logs.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { SeedModule } from './seed/seed.module';
import { SettingsModule } from './settings/settings.module';
import { WeightModule } from './weight/weight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    FoodsModule,
    LogsModule,
    SettingsModule,
    WeightModule,
    MeasurementsModule,
    SeedModule,
  ],
})
export class AppModule {}
