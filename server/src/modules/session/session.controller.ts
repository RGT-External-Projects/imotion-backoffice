import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SessionService } from './session.service';
import { SessionActivityLogService } from '../session-activity-log/session-activity-log.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { CompleteSessionDto } from './dto/complete-session.dto';
import { InterruptSessionDto } from './dto/interrupt-session.dto';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QuerySessionsDto } from './dto/query-sessions.dto';
import { PaginatedSessionsResponseDto } from './dto/paginated-sessions.response.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly activityLogService: SessionActivityLogService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Paginated list of sessions', type: PaginatedSessionsResponseDto })
  findAll(@Query() query: QuerySessionsDto) {
    return this.sessionService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single session by ID' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Session found' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.findOne(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiBody({ type: CompleteSessionDto })
  @ApiResponse({ status: 200, description: 'Session completed successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() completeDto: CompleteSessionDto,
  ) {
    return this.sessionService.complete(id, completeDto);
  }

  @Post(':id/interrupt')
  @ApiOperation({ summary: 'Interrupt a session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiBody({ type: InterruptSessionDto })
  @ApiResponse({ status: 200, description: 'Session interrupted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  interrupt(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() interruptDto: InterruptSessionDto,
  ) {
    return this.sessionService.interrupt(id, interruptDto);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause a session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Session paused successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  pause(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.pause(id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Session resumed successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  resume(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.resume(id);
  }

  @Post(':id/activity-logs')
  @ApiOperation({ 
    summary: 'Create an activity log for a session',
    description: 'For SETTINGS_CHANGED events, description and oldValue are optional - backend will auto-generate them'
  })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiBody({ type: CreateActivityLogDto })
  @ApiResponse({ status: 201, description: 'Activity log created successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  createActivityLog(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createActivityLogDto: CreateActivityLogDto,
  ) {
    return this.sessionService.createActivityLogSmart(id, createActivityLogDto);
  }

  @Get(':id/activity-logs')
  @ApiOperation({ summary: 'Get all activity logs for a session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'List of activity logs' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getActivityLogs(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.getActivityLogs(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  @ApiResponse({ status: 200, description: 'Session deleted successfully' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sessionService.remove(id);
  }
}
