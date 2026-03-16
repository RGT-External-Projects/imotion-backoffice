import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TherapistPhone } from './entities/therapist-phone.entity';
import { CreateTherapistPhoneDto } from './dto/create-therapist-phone.dto';
import { UpdateTherapistPhoneDto } from './dto/update-therapist-phone.dto';

@Injectable()
export class TherapistPhoneService {
  constructor(
    @InjectRepository(TherapistPhone)
    private readonly therapistPhoneRepository: Repository<TherapistPhone>,
  ) {}

  async create(createDto: CreateTherapistPhoneDto): Promise<TherapistPhone> {
    // Check if phone number already exists
    const existing = await this.therapistPhoneRepository.findOne({
      where: { phoneNumber: createDto.phoneNumber },
    });

    if (existing) {
      throw new ConflictException(
        `Therapist phone with number ${createDto.phoneNumber} already exists`,
      );
    }

    const phone = new TherapistPhone();
    phone.phoneNumber = createDto.phoneNumber;
    if (createDto.displayName) {
      phone.displayName = createDto.displayName;
    }

    return this.therapistPhoneRepository.save(phone);
  }

  async findAll(): Promise<TherapistPhone[]> {
    return this.therapistPhoneRepository.find({
      relations: ['devices'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<TherapistPhone> {
    const phone = await this.therapistPhoneRepository.findOne({
      where: { id },
      relations: ['devices', 'sessions'],
    });

    if (!phone) {
      throw new NotFoundException(`Therapist phone with ID ${id} not found`);
    }

    return phone;
  }

  async update(id: string, updateDto: UpdateTherapistPhoneDto): Promise<TherapistPhone> {
    const phone = await this.therapistPhoneRepository.findOne({ where: { id } });

    if (!phone) {
      throw new NotFoundException(`Therapist phone with ID ${id} not found`);
    }

    // Check for phone number conflicts if updating phone number
    if (updateDto.phoneNumber && updateDto.phoneNumber !== phone.phoneNumber) {
      const existing = await this.therapistPhoneRepository.findOne({
        where: { phoneNumber: updateDto.phoneNumber },
      });

      if (existing) {
        throw new ConflictException(
          `Therapist phone with number ${updateDto.phoneNumber} already exists`,
        );
      }
    }

    Object.assign(phone, updateDto);
    return this.therapistPhoneRepository.save(phone);
  }

  async remove(id: string): Promise<void> {
    const phone = await this.findOne(id);
    await this.therapistPhoneRepository.remove(phone);
  }

  async getDevices(id: string) {
    const phone = await this.findOne(id);
    return phone.devices;
  }

  async getSessions(id: string) {
    const phone = await this.findOne(id);
    return phone.sessions;
  }
}
