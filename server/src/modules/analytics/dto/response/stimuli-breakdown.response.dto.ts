import { ApiProperty } from '@nestjs/swagger';

export class StimuliBreakdownResponseDto {
  @ApiProperty({
    description: 'Percentage of sessions using visual stimuli',
    example: 50,
  })
  visual: number;

  @ApiProperty({
    description: 'Percentage of sessions using audio stimuli',
    example: 30,
  })
  audio: number;

  @ApiProperty({
    description: 'Percentage of sessions using tactile stimuli',
    example: 20,
  })
  tactile: number;
}
