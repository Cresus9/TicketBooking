import { Module } from '@nestjs/common';
import { CMSController } from './cms.controller';
import { CMSService } from './cms.service';

@Module({
  controllers: [CMSController],
  providers: [CMSService],
  exports: [CMSService],
})
export class CMSModule {}