import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsResponseDto {
  @ApiProperty({
    description: 'Number of sessions today',
    example: 124,
  })
  sessionsToday: number;

  @ApiProperty({
    description: 'Number of active devices',
    example: 18,
  })
  activeDevices: number;

  @ApiProperty({
    description: 'Total number of patients',
    example: 4,
  })
  totalPatients: number;

  @ApiProperty({
    description: 'Average session duration formatted',
    example: '9m 20s',
  })
  avgSessionDuration: string;
}
