import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsStatsService } from './services/analytics-stats.service';
import { AnalyticsChartsService } from './services/analytics-charts.service';
import { AnalyticsHelperService } from './services/analytics-helper.service';
import { Session } from '../session/entities/session.entity';
import { Device } from '../device/entities/device.entity';
import { Patient } from '../patient/entities/patient.entity';
import { TherapistPhone } from '../therapist-phone/entities/therapist-phone.entity';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Device, Patient, TherapistPhone]),
    SessionModule,
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsStatsService,
    AnalyticsChartsService,
    AnalyticsHelperService,
  ],
  exports: [AnalyticsStatsService, AnalyticsChartsService],
})
export class AnalyticsModule {}
