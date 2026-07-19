import { Module } from '@nestjs/common';
import { PushModule } from '../push/push.module';
import { QuestsModule } from '../quests/quests.module';
import { SettingsModule } from '../settings/settings.module';
import { WorkoutsModule } from '../workouts/workouts.module';
import { XpModule } from '../xp/xp.module';
import { HevyController } from './hevy.controller';
import { HevyService } from './hevy.service';

@Module({
  imports: [WorkoutsModule, SettingsModule, XpModule, QuestsModule, PushModule],
  controllers: [HevyController],
  providers: [HevyService],
})
export class HevyModule {}
