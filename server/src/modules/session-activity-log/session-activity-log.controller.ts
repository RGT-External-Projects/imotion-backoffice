import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SessionActivityLogService } from './session-activity-log.service';

@ApiTags('Session Activity Logs')
@Controller('session-activity-logs')
export class SessionActivityLogController {
  constructor(
    private readonly sessionActivityLogService: SessionActivityLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all session activity logs (optionally filtered by session)' })
  @ApiQuery({ name: 'sessionId', required: false, description: 'Filter by session UUID' })
  @ApiResponse({ status: 200, description: 'List of session activity logs' })
  findAll(@Query('sessionId') sessionId?: string) {
    if (sessionId) {
      return this.sessionActivityLogService.findBySession(sessionId);
    }
    // Could add a findAll method to service if needed
    return { message: 'Use sessionId query parameter to filter logs' };
  }
}
