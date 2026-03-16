import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDeviceDto {
  @ApiProperty({ description: 'Unique device identifier', example: 'IMOTION-DEV-001' })
  @IsString()
  deviceId: string;

  @ApiProperty({ description: 'Device serial number', example: 'SN-20260312-001' })
  @IsString()
  serialNumber: string;

  @ApiPropertyOptional({ description: 'Device model', example: 'iMotion Pro v2' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ description: 'Firmware version', example: '2.1.0' })
  @IsString()
  @IsOptional()
  firmwareVersion?: string;
}
