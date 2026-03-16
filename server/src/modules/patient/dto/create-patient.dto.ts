import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'Patient first name', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Patient last name', example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ description: 'Patient age', example: 45 })
  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  age?: number;

  @ApiPropertyOptional({ description: 'Patient notes or diagnosis', example: 'Prefers morning sessions' })
  @IsString()
  @IsOptional()
  notes?: string;
}
