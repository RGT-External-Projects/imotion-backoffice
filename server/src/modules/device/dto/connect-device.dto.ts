import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConnectDeviceDto {
  // PHONE INFORMATION (from mobile device)
  @ApiProperty({ 
    description: 'Unique phone identifier from device hardware', 
    example: 'ABC-123-PHONE-456' 
  })
  @IsString()
  phoneUniqueId: string;

  @ApiPropertyOptional({ 
    description: 'Phone model name', 
    example: 'iPhone 13 Pro' 
  })
  @IsString()
  @IsOptional()
  phoneModel?: string;

  @ApiPropertyOptional({ 
    description: 'Phone number (if available)', 
    example: '+233123456789' 
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  // DEVICE INFORMATION (from Bluetooth)
  @ApiProperty({ 
    description: 'Device identifier from Bluetooth scan', 
    example: 'IMOTION-DEV-001' 
  })
  @IsString()
  deviceId: string;

  @ApiPropertyOptional({ 
    description: 'Device serial number', 
    example: 'SN-20260312-001' 
  })
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @ApiPropertyOptional({ 
    description: 'Device model name', 
    example: 'iMotion Pro v2' 
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ 
    description: 'Firmware version', 
    example: '2.1.0' 
  })
  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @ApiPropertyOptional({ 
    description: 'Battery level percentage', 
    example: 85 
  })
  @IsNumber()
  @IsOptional()
  batteryLevel?: number;

  @ApiPropertyOptional({ 
    description: 'Bluetooth signal strength in dBm', 
    example: -45 
  })
  @IsNumber()
  @IsOptional()
  signalStrength?: number;
}
