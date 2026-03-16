import { ApiProperty } from '@nestjs/swagger';

export class SessionDataPoint {
  @ApiProperty({
    description: 'Date in format YYYY-MM-DD or MMM DD',
    example: 'Oct 1',
  })
  date: string;

  @ApiProperty({
    description: 'Number of sessions on this date',
    example: 20,
  })
  count: number;
}

export class SessionsOverTimeResponseDto {
  @ApiProperty({
    description: 'Array of session counts by date',
    type: [SessionDataPoint],
    example: [
      { date: '2026-10-01', count: 20 },
      { date: '2026-10-02', count: 80 },
      { date: '2026-10-03', count: 100 },
    ],
  })
  data: SessionDataPoint[];
}
