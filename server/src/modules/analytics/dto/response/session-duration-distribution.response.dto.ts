import { ApiProperty } from '@nestjs/swagger';

export class DurationBucket {
  @ApiProperty({
    description: 'Duration range label',
    example: '0-5 min',
  })
  range: string;

  @ApiProperty({
    description: 'Number of sessions in this range',
    example: 20,
  })
  count: number;
}

export class SessionDurationDistributionResponseDto {
  @ApiProperty({
    description: 'Array of duration buckets',
    type: [DurationBucket],
    example: [
      { range: '0-5 min', count: 20 },
      { range: '5-10 min', count: 45 },
      { range: '10-15 min', count: 35 },
    ],
  })
  buckets: DurationBucket[];
}
