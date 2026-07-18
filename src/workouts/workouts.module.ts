import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsModule } from '../quests/quests.module';
import { XpModule } from '../xp/xp.module';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import {
  WorkoutSession,
  WorkoutSessionSchema,
} from './schemas/workout-session.schema';

@Module({
  imports: [
    XpModule,
    QuestsModule,
    MongooseModule.forFeature([
      { name: WorkoutSession.name, schema: WorkoutSessionSchema },
    ]),
  ],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService, MongooseModule],
})
export class WorkoutsModule {}
