import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../entities/session.entity';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number' })
  currentPage: number;

  @ApiProperty({ description: 'Items per page' })
  itemsPerPage: number;

  @ApiProperty({ description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPreviousPage: boolean;
}

export class PaginatedSessionsResponseDto {
  @ApiProperty({ description: 'Array of sessions', type: [Session] })
  data: Session[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  meta: PaginationMeta;
}
