import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteSessionDto {
  @ApiProperty({
    description: 'Session duration in seconds',
    example: 600,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  duration: number;
}
