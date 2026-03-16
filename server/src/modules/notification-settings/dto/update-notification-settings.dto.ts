import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional({ description: 'Email notification for session completed' })
  @IsBoolean()
  @IsOptional()
  emailSessionCompleted?: boolean;

  @ApiPropertyOptional({ description: 'Email notification for new device' })
  @IsBoolean()
  @IsOptional()
  emailNewDevice?: boolean;

  @ApiPropertyOptional({ description: 'Email notification for daily summary' })
  @IsBoolean()
  @IsOptional()
  emailDailySummary?: boolean;

  @ApiPropertyOptional({ description: 'Push notification for device disconnected' })
  @IsBoolean()
  @IsOptional()
  pushDeviceDisconnected?: boolean;

  @ApiPropertyOptional({ description: 'Push notification for session interrupted' })
  @IsBoolean()
  @IsOptional()
  pushSessionInterrupted?: boolean;
}
