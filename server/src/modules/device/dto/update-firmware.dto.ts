import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFirmwareDto {
  @ApiProperty({ description: 'New firmware version' })
  @IsString()
  newVersion: string;
}
