import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@ApiTags('Configurations')
@Controller('configurations')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new configuration' })
  @ApiBody({ type: CreatePatientDto })
  @ApiResponse({ status: 201, description: 'Configuration created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all configurations' })
  @ApiQuery({
    name: 'therapistPhoneId',
    required: false,
    description: 'Therapist phone UUID to filter configurations by',
  })
  @ApiQuery({
    name: 'therapistPhoneUniqueId',
    required: false,
    description: 'Therapist phone unique identifier / phone number to filter configurations by',
  })
  @ApiResponse({ status: 200, description: 'List of all configurations' })
  findAll(
    @Query('therapistPhoneId') therapistPhoneId?: string,
    @Query('therapistPhoneUniqueId') therapistPhoneUniqueId?: string,
  ) {
    if (therapistPhoneId) {
      return this.patientService.findByTherapistPhone(therapistPhoneId);
    }
    if (therapistPhoneUniqueId) {
      return this.patientService.findByTherapistPhoneUniqueId(
        therapistPhoneUniqueId,
      );
    }
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single configuration by ID' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiResponse({ status: 200, description: 'Configuration found' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a configuration' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiBody({ type: UpdatePatientDto })
  @ApiResponse({ status: 200, description: 'Configuration updated successfully' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Get(':id/sessions')
  @ApiOperation({ summary: 'Get all sessions for a configuration' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiResponse({ status: 200, description: 'List of sessions' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  getSessions(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.getSessions(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a configuration' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiResponse({ status: 200, description: 'Configuration deleted successfully' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientService.remove(id);
  }
}
