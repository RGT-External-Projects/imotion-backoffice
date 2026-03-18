import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionActivityEventType } from '../../session-activity-log/entities/session-activity-log.entity';

export class CreateActivityLogDto {
  @ApiProperty({
    description: 'Type of activity event',
    enum: SessionActivityEventType,
    example: SessionActivityEventType.SETTINGS_CHANGED,
    examples: {
      settingsChange: {
        value: SessionActivityEventType.SETTINGS_CHANGED,
        description: 'When session settings are modified',
      },
      sessionStart: {
        value: SessionActivityEventType.SESSION_STARTED,
        description: 'When session begins (auto-created)',
      },
      sessionPause: {
        value: SessionActivityEventType.SESSION_PAUSED,
        description: 'When session is paused (auto-created)',
      },
    },
  })
  @IsEnum(SessionActivityEventType)
  eventType: SessionActivityEventType;

  @ApiProperty({
    description: 'Human-readable description of the event',
    example: 'Increased vibration intensity from 50 to 70',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Additional event metadata (flexible JSON object). For SETTINGS_CHANGED, include settingPath for auto-computation of finalSettings',
    example: {
      settingPath: 'vibration.intensity',
      oldValue: 50,
      newValue: 70,
    },
    examples: {
      settingsChange: {
        value: {
          settingPath: 'vibration.intensity',
          oldValue: 50,
          newValue: 70,
        },
        description: 'Settings change metadata (settingPath is important)',
      },
      patientResponse: {
        value: {
          patientFeedback: 'Feeling relaxed',
          therapistNote: 'Patient responding well',
        },
        description: 'Custom metadata - any keys allowed',
      },
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
