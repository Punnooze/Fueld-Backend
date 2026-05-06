import { Module } from '@nestjs/common';
import { FoodsModule } from '../foods/foods.module';
import { SettingsModule } from '../settings/settings.module';
import { SeedService } from './seed.service';

@Module({
  imports: [FoodsModule, SettingsModule],
  providers: [SeedService],
})
export class SeedModule {}
