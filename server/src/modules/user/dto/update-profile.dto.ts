import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Full name' })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({ description: 'Current password (required if changing password)' })
  @IsString()
  @IsOptional()
  currentPassword?: string;

  @ApiPropertyOptional({ description: 'New password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  newPassword?: string;
}
