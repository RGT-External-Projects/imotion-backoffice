import { IsEmail, IsString, MinLength, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'therapist@imotion.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password (min 6 characters)', example: 'SecurePass123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Full name of the user', example: 'Dr. Jane Smith' })
  @IsString()
  fullName: string;

  @ApiPropertyOptional({ description: 'Role UUID (defaults to standard user role)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsOptional()
  roleId?: string;
}
