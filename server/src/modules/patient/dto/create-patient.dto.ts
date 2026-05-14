import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
