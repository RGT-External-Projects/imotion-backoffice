import { IsEmail, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty({ description: 'Email address to send invitation', example: 'newuser@imotion.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Role UUID for the invited user', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  roleId: string;
}
