import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'Patient name', example: 'Emeralda Angie' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Patient tags', example: ['PTSD', 'Anxiety'] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Patient notes', example: 'Prefers slower speeds with audio feedback' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Patient status', example: 'active' })
  @IsString()
  @IsOptional()
  status?: string;
}
