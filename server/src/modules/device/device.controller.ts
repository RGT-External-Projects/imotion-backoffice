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
import { DeviceService } from './device.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { ConnectDeviceDto } from './dto/connect-device.dto';
import { UpdateFirmwareDto } from './dto/update-firmware.dto';
import { PairPhoneDto } from './dto/pair-phone.dto';
import { QueryDevicesDto } from './dto/query-devices.dto';
import { PaginatedDevicesResponseDto } from './dto/paginated-devices.response.dto';

@ApiTags('Devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new device in the system' })
  @ApiBody({ type: RegisterDeviceDto })
  @ApiResponse({ status: 201, description: 'Device registered successfully' })
  @ApiResponse({ status: 409, description: 'Device already exists' })
  register(@Body() registerDto: RegisterDeviceDto) {
    return this.deviceService.register(registerDto);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get all devices with pagination, filtering, and search' })
  @ApiResponse({ status: 200, description: 'Paginated list of devices', type: PaginatedDevicesResponseDto })
  findAllPaginated(@Query() query: QueryDevicesDto) {
    return this.deviceService.findAllPaginated(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all devices (legacy - without pagination)' })
  @ApiResponse({ status: 200, description: 'List of all devices' })
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single device by ID' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({ status: 200, description: 'Device found' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.findOne(id);
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect to a device via Bluetooth (auto-registers device and phone if needed)' })
  @ApiBody({ type: ConnectDeviceDto })
  @ApiResponse({ status: 200, description: 'Device connected successfully' })
  @ApiResponse({ status: 201, description: 'Device and/or phone auto-registered and connected' })
  connect(@Body() connectDto: ConnectDeviceDto) {
    return this.deviceService.connect(connectDto);
  }

  @Post(':id/disconnect/:phoneId')
  @ApiOperation({ summary: 'Disconnect a device' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiParam({ name: 'phoneId', description: 'Therapist phone UUID' })
  @ApiResponse({ status: 200, description: 'Device disconnected successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  disconnect(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('phoneId', ParseUUIDPipe) phoneId: string,
  ) {
    return this.deviceService.disconnect(id, phoneId);
  }

  @Post(':id/firmware')
  @ApiOperation({ summary: 'Update device firmware' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiBody({ type: UpdateFirmwareDto })
  @ApiResponse({ status: 200, description: 'Firmware updated successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  updateFirmware(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateFirmwareDto,
  ) {
    return this.deviceService.updateFirmware(id, updateDto);
  }

  @Post(':id/pair')
  @ApiOperation({ summary: 'Pair device with a therapist phone' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiBody({ type: PairPhoneDto })
  @ApiResponse({ status: 200, description: 'Device paired successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  pairPhone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() pairDto: PairPhoneDto,
  ) {
    return this.deviceService.pairPhone(id, pairDto);
  }

  @Delete(':id/unpair/:phoneId')
  @ApiOperation({ summary: 'Unpair device from a therapist phone' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiParam({ name: 'phoneId', description: 'Therapist phone UUID' })
  @ApiResponse({ status: 200, description: 'Device unpaired successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  unpairPhone(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('phoneId', ParseUUIDPipe) phoneId: string,
  ) {
    return this.deviceService.unpairPhone(id, phoneId);
  }

  @Get(':id/activity-logs')
  @ApiOperation({ summary: 'Get all activity logs for a device' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({ status: 200, description: 'List of activity logs' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  getActivityLogs(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.getActivityLogs(id);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get all sessions for a device' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({ status: 200, description: 'List of sessions' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  getSessions(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.getSessions(id);
  }

  @Get(':id/therapist-phones')
  @ApiOperation({ summary: 'Get all paired therapist phones for a device' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({ status: 200, description: 'List of therapist phones' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  getTherapistPhones(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.getTherapistPhones(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a device' })
  @ApiParam({ name: 'id', description: 'Device UUID' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully' })
  @ApiResponse({ status: 404, description: 'Device not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deviceService.remove(id);
  }
}
