import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { SessionSettings } from '../../session/entities/session.entity';

export class CreatePatientDto {
  @ApiProperty({ description: 'Configuration name', example: 'Emeralda Angie' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Configuration tags', example: ['PTSD', 'Anxiety'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Configuration notes', example: 'Prefers slower speeds with audio feedback' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Configuration status', example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Therapist phone unique identifier (natural ID / phone number, not database UUID)',
    example: 'ABC-123-PHONE-456',
  })
  @IsString()
  @IsOptional()
  therapistPhoneUniqueId?: string;

  @ApiPropertyOptional({
    description: 'Session settings for this configuration (stored as preferred settings)',
    example: {
      visual: {
        enabled: true,
        color: '#FF0000',
        speed: 5,
        movement: 'circular',
      },
      vibration: {
        enabled: true,
        intensity: 70,
        pulse: 'steady',
        speed: 3,
      },
      audio: {
        enabled: false,
        volume: 60,
        type: 'nature',
      },
      speed: {
        enabled: true,
        value: 5,
      },
    },
  })
  @IsObject()
  @IsOptional()
  sessionSettings?: SessionSettings;
}
