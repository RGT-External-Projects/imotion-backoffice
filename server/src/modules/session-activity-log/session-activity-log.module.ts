import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionActivityLog } from './entities/session-activity-log.entity';
import { SessionActivityLogService } from './session-activity-log.service';
import { SessionActivityLogController } from './session-activity-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SessionActivityLog])],
  controllers: [SessionActivityLogController],
  providers: [SessionActivityLogService],
  exports: [SessionActivityLogService],
})
export class SessionActivityLogModule {}
