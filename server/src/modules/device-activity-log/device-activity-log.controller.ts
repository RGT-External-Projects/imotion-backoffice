import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DeviceActivityLogService } from './device-activity-log.service';

@ApiTags('Device Activity Logs')
@Controller('device-activity-logs')
export class DeviceActivityLogController {
  constructor(
    private readonly deviceActivityLogService: DeviceActivityLogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all device activity logs (optionally filtered by device)' })
  @ApiQuery({ name: 'deviceId', required: false, description: 'Filter by device UUID' })
  @ApiResponse({ status: 200, description: 'List of device activity logs' })
  findAll(@Query('deviceId') deviceId?: string) {
    if (deviceId) {
      return this.deviceActivityLogService.findByDevice(deviceId);
    }
    // Could add a findAll method to service if needed
    return { message: 'Use deviceId query parameter to filter logs' };
  }
}
