import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';
import { SessionSettings } from '../../session/entities/session.entity';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiPropertyOptional({ 
    description: 'Patient preferred session settings',
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
    }
  })
  @IsObject()
  @IsOptional()
  preferredSettings?: SessionSettings | null;
}
