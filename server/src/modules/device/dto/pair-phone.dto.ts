import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PairPhoneDto {
  @ApiProperty({ description: 'Therapist phone UUID to pair with device' })
  @IsUUID()
  therapistPhoneId: string;
}
