import { IsUUID, IsObject, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { SessionSettings } from '../entities/session.entity';

export class CreateSessionDto {
  @ApiProperty({
    description: 'UUID of the device',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  deviceId: string;

  @ApiProperty({
    description: 'UUID of the therapist phone',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  therapistPhoneId: string;

  @ApiProperty({
    description: 'UUID of the patient',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'Initial session settings',
    example: {
      visual: {
        brightness: 80,
        contrast: 70,
        colorMode: 'standard',
      },
      audio: {
        volume: 60,
        soundType: 'nature',
      },
      tactile: {
        intensity: 50,
        pattern: 'wave',
      },
    },
  })
  @IsObject()
  initialSettings: SessionSettings;

  @ApiProperty({
    description: 'Session start timestamp (optional - defaults to current time if not provided)',
    example: '2026-03-12T10:00:00Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  sessionTimestamp?: string;
}
