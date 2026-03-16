import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSettings } from './entities/notification-settings.entity';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@Injectable()
export class NotificationSettingsService {
  constructor(
    @InjectRepository(NotificationSettings)
    private readonly settingsRepository: Repository<NotificationSettings>,
  ) {}

  async createDefaultSettings(userId: string): Promise<NotificationSettings> {
    const settings = new NotificationSettings();
    settings.userId = userId;
    settings.emailSessionCompleted = true;
    settings.emailNewDevice = false;
    settings.emailDailySummary = true;
    settings.pushDeviceDisconnected = true;
    settings.pushSessionInterrupted = true;

    return this.settingsRepository.save(settings);
  }

  async findByUserId(userId: string): Promise<NotificationSettings> {
    let settings = await this.settingsRepository.findOne({
      where: { userId },
    });

    if (!settings) {
      // Auto-create if not exists
      settings = await this.createDefaultSettings(userId);
    }

    return settings;
  }

  async update(
    userId: string,
    updateDto: UpdateNotificationSettingsDto,
  ): Promise<NotificationSettings> {
    const settings = await this.findByUserId(userId);

    Object.assign(settings, updateDto);
    return this.settingsRepository.save(settings);
  }
}
