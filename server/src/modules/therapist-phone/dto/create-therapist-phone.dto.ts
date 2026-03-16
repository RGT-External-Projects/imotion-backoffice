import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTherapistPhoneDto {
  @ApiProperty({ 
    description: 'Therapist phone number (unique identifier)', 
    example: '+1234567890'
  })
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({ 
    description: 'Display name for the therapist', 
    example: 'Dr. Sarah Johnson'
  })
  @IsString()
  @IsOptional()
  displayName?: string;
}
