import { IsUUID, IsObject, IsDateString, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { SessionSettings } from '../entities/session.entity';

export class CreateSessionDto {
  @ApiProperty({
    description: 'Device identifier (natural ID from device, not database UUID)',
    example: 'IMOTION-DEV-001',
  })
  @IsString()
  deviceId: string;

  @ApiProperty({
    description: 'Phone unique identifier (natural ID from phone, not database UUID)',
    example: 'ABC-123-PHONE-456',
  })
  @IsString()
  phoneUniqueId: string;

  @ApiProperty({
    description: 'UUID of the patient (from patient selection)',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'Initial session settings',
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

  @ApiProperty({
    description: 'Phone model for logging purposes (optional)',
    example: 'iPhone 13 Pro',
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneModel?: string;

  @ApiProperty({
    description: 'Device serial number (optional)',
    example: 'SN-20260312-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiProperty({
    description: 'Device firmware version (optional)',
    example: '2.1.0',
    required: false,
  })
  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @ApiProperty({
    description: 'Phone battery level percentage (optional)',
    example: 85,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  batteryLevel?: number;

  @ApiProperty({
    description: 'Bluetooth signal strength in dBm (optional)',
    example: -45,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  signalStrength?: number;
}
