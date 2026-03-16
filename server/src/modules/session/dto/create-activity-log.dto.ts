import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';
import { SessionActivityEventType } from '../../session-activity-log/entities/session-activity-log.entity';

export class CreateActivityLogDto {
  @IsEnum(SessionActivityEventType)
  eventType: SessionActivityEventType;

  @IsString()
  description: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
