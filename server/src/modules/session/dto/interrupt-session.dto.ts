import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class InterruptSessionDto {
  @IsNumber()
  @IsPositive()
  duration: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
