import { PartialType } from '@nestjs/swagger';
import { CreateTherapistPhoneDto } from './create-therapist-phone.dto';

export class UpdateTherapistPhoneDto extends PartialType(CreateTherapistPhoneDto) {}
