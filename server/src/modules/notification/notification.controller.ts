import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for current user' })
  @ApiQuery({ name: 'userId', description: 'User UUID', required: true })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  findAll(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.notificationService.findByUser(userId);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count for current user' })
  @ApiQuery({ name: 'userId', description: 'User UUID', required: true })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@Query('userId', ParseUUIDPipe) userId: string) {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  markAsRead(@Param('id', ParseUUIDPipe) id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read for current user' })
  @ApiQuery({ name: 'userId', description: 'User UUID', required: true })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Query('userId', ParseUUIDPipe) userId: string) {
    await this.notificationService.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete/dismiss a notification' })
  @ApiParam({ name: 'id', description: 'Notification UUID' })
  @ApiResponse({ status: 200, description: 'Notification deleted' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.notificationService.remove(id);
    return { message: 'Notification deleted' };
  }
}
