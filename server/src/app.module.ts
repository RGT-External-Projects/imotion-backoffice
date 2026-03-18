import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { winstonTransports } from './common/logger/winston.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from './config/database.config';
import { SessionModule } from './modules/session/session.module';
import { SessionActivityLogModule } from './modules/session-activity-log/session-activity-log.module';
import { DeviceModule } from './modules/device/device.module';
import { DeviceActivityLogModule } from './modules/device-activity-log/device-activity-log.module';
import { PatientModule } from './modules/patient/patient.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { TherapistPhoneModule } from './modules/therapist-phone/therapist-phone.module';
import { NotificationSettingsModule } from './modules/notification-settings/notification-settings.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SeedModule } from './seed/seed.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Database
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // Rate Limiting (100 requests per 15 minutes per IP)
    ThrottlerModule.forRoot([{
      ttl: 900000, // 15 minutes in milliseconds
      limit: 100,
    }]),
    // Winston Logger (for structured logging)
    WinstonModule.forRoot({
      transports: winstonTransports,
    }),
    // Feature modules
    HealthModule,
    SessionModule,
    SessionActivityLogModule,
    DeviceModule,
    DeviceActivityLogModule,
    PatientModule,
    UserModule,
    RoleModule,
    TherapistPhoneModule,
    NotificationSettingsModule,
    NotificationModule,
    AnalyticsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
