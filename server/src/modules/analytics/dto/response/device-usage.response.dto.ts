import { ApiProperty } from '@nestjs/swagger';

export class DeviceUsageItem {
  @ApiProperty({
    description: 'Device UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  deviceId: string;

  @ApiProperty({
    description: 'Device name',
    example: 'D-103',
  })
  deviceName: string;

  @ApiProperty({
    description: 'Usage percentage',
    example: 85,
  })
  usagePercentage: number;

  @ApiProperty({
    description: 'Total session count',
    example: 120,
  })
  sessionCount: number;
}

export class DeviceUsageResponseDto {
  @ApiProperty({
    description: 'Array of device usage statistics',
    type: [DeviceUsageItem],
  })
  devices: DeviceUsageItem[];
}
