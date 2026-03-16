import { IsNumber, IsPositive } from 'class-validator';

export class CompleteSessionDto {
  @IsNumber()
  @IsPositive()
  duration: number;
}
