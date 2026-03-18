import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InterruptSessionDto {
  @ApiProperty({
    description: 'Session duration in seconds up to interruption point',
    example: 300,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiPropertyOptional({
    description: 'Reason for interruption',
    example: 'Patient felt uncomfortable',
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
