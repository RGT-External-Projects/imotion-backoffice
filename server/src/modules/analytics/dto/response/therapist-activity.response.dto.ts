import { ApiProperty } from '@nestjs/swagger';

export class TherapistActivityItem {
  @ApiProperty({
    description: 'Therapist phone UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  therapistPhoneId: string;

  @ApiProperty({
    description: 'Therapist display name',
    example: 'Therapist 1',
  })
  displayName: string;

  @ApiProperty({
    description: 'Total session count',
    example: 124,
  })
  sessionCount: number;
}

export class TherapistActivityResponseDto {
  @ApiProperty({
    description: 'Array of therapist activity statistics',
    type: [TherapistActivityItem],
  })
  therapists: TherapistActivityItem[];
}
