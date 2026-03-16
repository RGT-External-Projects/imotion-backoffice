import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { NotificationSettingsService } from './notification-settings.service';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@ApiTags('Notification Settings')
@Controller('users/:userId/notification-settings')
export class NotificationSettingsController {
  constructor(
    private readonly settingsService: NotificationSettingsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user notification settings' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'Notification settings retrieved' })
  getSettings(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.settingsService.findByUserId(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update user notification settings' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiBody({ type: UpdateNotificationSettingsDto })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  updateSettings(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateDto: UpdateNotificationSettingsDto,
  ) {
    return this.settingsService.update(userId, updateDto);
  }
}
