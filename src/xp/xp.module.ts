import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { XpController } from './xp.controller';
import { XpService } from './xp.service';
import { XPEvent, XPEventSchema } from './schemas/xp-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: XPEvent.name, schema: XPEventSchema }]),
  ],
  controllers: [XpController],
  providers: [XpService],
  exports: [XpService, MongooseModule],
})
export class XpModule {}
