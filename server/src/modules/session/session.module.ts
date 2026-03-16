import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionActivityLogModule } from '../session-activity-log/session-activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    SessionActivityLogModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
