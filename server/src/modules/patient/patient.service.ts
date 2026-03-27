import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Generate unique patient code
    const patientCode = await this.generatePatientCode();
    
    const patient = new Patient();
    patient.patientCode = patientCode;
    patient.name = createPatientDto.name;
    patient.tags = createPatientDto.tags || [];
    if (createPatientDto.notes) {
      patient.notes = createPatientDto.notes;
    }
    patient.status = createPatientDto.status || 'active';
    return this.patientRepository.save(patient);
  }

  private async generatePatientCode(): Promise<string> {
    const maxRetries = 10;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        // Get the count of existing patients to generate sequential code
        const count = await this.patientRepository.count();
        const nextNumber = count + 1 + attempt; // Add attempt to handle concurrent requests
        
        // Format as PAT-0001, PAT-0002, etc.
        const code = `PAT-${nextNumber.toString().padStart(4, '0')}`;
        
        // Check if code already exists (edge case for concurrent requests)
        const existing = await this.patientRepository.findOne({
          where: { patientCode: code },
        });
        
        if (!existing) {
          return code;
        }
        
        attempt++;
      } catch (error) {
        console.error('Error generating patient code:', error);
        attempt++;
        
        // Wait briefly before retry to avoid hammering the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Fallback: use timestamp-based code if all retries fail
    const timestamp = Date.now();
    return `PAT-${timestamp.toString().slice(-8)}`;
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['sessions'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto);
    return this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }

  async getSessions(id: string) {
    const patient = await this.findOne(id);
    return patient.sessions;
  }
}
