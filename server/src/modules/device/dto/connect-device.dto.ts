import { IsUUID, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConnectDeviceDto {
  @ApiProperty({ description: 'Therapist phone UUID' })
  @IsUUID()
  therapistPhoneId: string;

  @ApiPropertyOptional({ description: 'Battery level percentage' })
  @IsNumber()
  @IsOptional()
  batteryLevel?: number;

  @ApiPropertyOptional({ description: 'Bluetooth signal strength' })
  @IsNumber()
  @IsOptional()
  signalStrength?: number;
}
