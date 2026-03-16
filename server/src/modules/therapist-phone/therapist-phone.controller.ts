import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TherapistPhoneService } from './therapist-phone.service';
import { CreateTherapistPhoneDto } from './dto/create-therapist-phone.dto';
import { UpdateTherapistPhoneDto } from './dto/update-therapist-phone.dto';

@ApiTags('Therapist Phones')
@Controller('therapist-phones')
export class TherapistPhoneController {
  constructor(private readonly therapistPhoneService: TherapistPhoneService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new therapist phone' })
  @ApiBody({ type: CreateTherapistPhoneDto })
  @ApiResponse({ status: 201, description: 'Therapist phone registered successfully' })
  @ApiResponse({ status: 409, description: 'Phone number already exists' })
  create(@Body() createTherapistPhoneDto: CreateTherapistPhoneDto) {
    return this.therapistPhoneService.create(createTherapistPhoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all therapist phones' })
  @ApiResponse({ status: 200, description: 'List of all therapist phones' })
  findAll() {
    return this.therapistPhoneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single therapist phone by ID' })
  @ApiParam({ name: 'id', description: 'Therapist Phone UUID' })
  @ApiResponse({ status: 200, description: 'Therapist phone found' })
  @ApiResponse({ status: 404, description: 'Therapist phone not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.therapistPhoneService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a therapist phone' })
  @ApiParam({ name: 'id', description: 'Therapist Phone UUID' })
  @ApiBody({ type: UpdateTherapistPhoneDto })
  @ApiResponse({ status: 200, description: 'Therapist phone updated successfully' })
  @ApiResponse({ status: 404, description: 'Therapist phone not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTherapistPhoneDto: UpdateTherapistPhoneDto,
  ) {
    return this.therapistPhoneService.update(id, updateTherapistPhoneDto);
  }

  @Get(':id/devices')
  @ApiOperation({ summary: 'Get all devices paired with this therapist phone' })
  @ApiParam({ name: 'id', description: 'Therapist Phone UUID' })
  @ApiResponse({ status: 200, description: 'List of paired devices' })
  @ApiResponse({ status: 404, description: 'Therapist phone not found' })
  getDevices(@Param('id', ParseUUIDPipe) id: string) {
    return this.therapistPhoneService.getDevices(id);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get all sessions conducted by this therapist phone' })
  @ApiParam({ name: 'id', description: 'Therapist Phone UUID' })
  @ApiResponse({ status: 200, description: 'List of sessions' })
  @ApiResponse({ status: 404, description: 'Therapist phone not found' })
  getSessions(@Param('id', ParseUUIDPipe) id: string) {
    return this.therapistPhoneService.getSessions(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a therapist phone' })
  @ApiParam({ name: 'id', description: 'Therapist Phone UUID' })
  @ApiResponse({ status: 200, description: 'Therapist phone deleted successfully' })
  @ApiResponse({ status: 404, description: 'Therapist phone not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.therapistPhoneService.remove(id);
  }
}
