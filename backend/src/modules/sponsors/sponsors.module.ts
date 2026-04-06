import { Module } from '@nestjs/common';
import { SponsorsController } from './sponsors.controller';
import { SponsorsService } from './sponsors.service';

@Module({
  controllers: [SponsorsController],
  providers: [SponsorsService],
  exports: [SponsorsService],
})
export class SponsorsModule {}
