import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './character/character.module';
import { FitbitModule } from './fitbit/fitbit.module';
import { FoodsModule } from './foods/foods.module';
import { HealthModule } from './health/health.module';
import { HevyModule } from './hevy/hevy.module';
import { LogsModule } from './logs/logs.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { QuestsModule } from './quests/quests.module';
import { SeedModule } from './seed/seed.module';
import { SettingsModule } from './settings/settings.module';
import { WeightModule } from './weight/weight.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { XpModule } from './xp/xp.module';

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
    XpModule,
    WorkoutsModule,
    QuestsModule,
    CharacterModule,
    HevyModule,
    HealthModule,
    FitbitModule,
    SeedModule,
  ],
})
export class AppModule {}
