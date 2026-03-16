import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsStatsResponseDto {
  @ApiProperty({
    description: 'Total number of sessions (filtered)',
    example: 365,
  })
  totalSessions: number;

  @ApiProperty({
    description: 'Number of active devices (filtered)',
    example: 24,
  })
  activeDevices: number;

  @ApiProperty({
    description: 'Average session duration formatted (filtered)',
    example: '12m 30s',
  })
  avgSessionDuration: string;
}
