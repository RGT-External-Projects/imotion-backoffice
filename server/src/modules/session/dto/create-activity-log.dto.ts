import { IsEnum, IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionActivityEventType } from '../../session-activity-log/entities/session-activity-log.entity';

export class CreateActivityLogDto {
  @ApiProperty({
    description: 'Type of activity event',
    enum: SessionActivityEventType,
    example: SessionActivityEventType.SETTINGS_CHANGED,
    examples: {
      settingsChange: {
        value: SessionActivityEventType.SETTINGS_CHANGED,
        description: 'When session settings are modified',
      },
      sessionStart: {
        value: SessionActivityEventType.SESSION_STARTED,
        description: 'When session begins (auto-created)',
      },
      sessionPause: {
        value: SessionActivityEventType.SESSION_PAUSED,
        description: 'When session is paused (auto-created)',
      },
    },
  })
  @IsEnum(SessionActivityEventType)
  eventType: SessionActivityEventType;

  @ApiPropertyOptional({
    description: 'Human-readable description of the event (optional - auto-generated for SETTINGS_CHANGED if not provided)',
    example: 'Increased vibration intensity from 50 to 70',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: `Additional event metadata (flexible JSON object).
    
For SETTINGS_CHANGED events:
- Use "changes" array for multiple settings changed simultaneously
- Each change REQUIRES: settingPath, newValue
- oldValue is OPTIONAL - backend auto-fills it from previous activity logs or initialSettings
- Backend will auto-generate description if not provided

Available Setting Paths:
  VISUAL STIMULUS:
    - visual.enabled (boolean)
    - visual.color (string, e.g., "#FF0000")
    - visual.speed (number, 0-100)
    - visual.movement (string, e.g., "circular", "linear")
  
  VIBRATION STIMULUS:
    - vibration.enabled (boolean)
    - vibration.intensity (number, 0-100)
    - vibration.pulse (string, e.g., "steady", "pulsing")
    - vibration.speed (number, 0-100)
  
  AUDIO STIMULUS:
    - audio.enabled (boolean)
    - audio.volume (number, 0-100)
    - audio.type (string, e.g., "binaural", "white-noise")`,
    example: {
      changes: [
        { settingPath: 'vibration.intensity', newValue: 70 },
        { settingPath: 'audio.volume', newValue: 45 },
      ],
    },
    examples: {
      singleSetting_Recommended: {
        value: {
          settingPath: 'vibration.intensity',
          newValue: 70,
        },
        description: '✅ RECOMMENDED: Single setting - backend auto-fills oldValue & description',
      },
      multipleSettings_Recommended: {
        value: {
          changes: [
            { settingPath: 'vibration.intensity', newValue: 75 },
            { settingPath: 'audio.volume', newValue: 50 },
          ],
        },
        description: '✅ RECOMMENDED: Multiple settings - oldValue auto-filled by backend',
      },
      allVisualSettings: {
        value: {
          changes: [
            { settingPath: 'visual.enabled', newValue: true },
            { settingPath: 'visual.color', newValue: '#00FF00' },
            { settingPath: 'visual.speed', newValue: 70 },
            { settingPath: 'visual.movement', newValue: 'circular' },
          ],
        },
        description: 'Change ALL visual stimulus settings at once',
      },
      allVibrationSettings: {
        value: {
          changes: [
            { settingPath: 'vibration.enabled', newValue: true },
            { settingPath: 'vibration.intensity', newValue: 80 },
            { settingPath: 'vibration.pulse', newValue: 'pulsing' },
            { settingPath: 'vibration.speed', newValue: 90 },
          ],
        },
        description: 'Change ALL vibration stimulus settings at once',
      },
      allAudioSettings: {
        value: {
          changes: [
            { settingPath: 'audio.enabled', newValue: true },
            { settingPath: 'audio.volume', newValue: 60 },
            { settingPath: 'audio.type', newValue: 'binaural' },
          ],
        },
        description: 'Change ALL audio stimulus settings at once',
      },
      visualAndVibration: {
        value: {
          changes: [
            { settingPath: 'visual.speed', newValue: 85 },
            { settingPath: 'visual.movement', newValue: 'circular' },
            { settingPath: 'vibration.intensity', newValue: 90 },
            { settingPath: 'vibration.pulse', newValue: 'steady' },
          ],
        },
        description: 'Adjust visual + vibration together',
      },
      vibrationAndAudio: {
        value: {
          changes: [
            { settingPath: 'vibration.intensity', newValue: 65 },
            { settingPath: 'audio.volume', newValue: 55 },
            { settingPath: 'audio.type', newValue: 'white-noise' },
          ],
        },
        description: 'Adjust vibration + audio together',
      },
      visualAndAudio: {
        value: {
          changes: [
            { settingPath: 'visual.color', newValue: '#FF00FF' },
            { settingPath: 'visual.speed', newValue: 60 },
            { settingPath: 'audio.volume', newValue: 70 },
          ],
        },
        description: 'Adjust visual + audio together',
      },
      allStimuliComplete: {
        value: {
          changes: [
            { settingPath: 'visual.enabled', newValue: true },
            { settingPath: 'visual.color', newValue: '#0000FF' },
            { settingPath: 'visual.speed', newValue: 70 },
            { settingPath: 'visual.movement', newValue: 'circular' },
            { settingPath: 'vibration.enabled', newValue: true },
            { settingPath: 'vibration.intensity', newValue: 85 },
            { settingPath: 'vibration.pulse', newValue: 'pulsing' },
            { settingPath: 'vibration.speed', newValue: 95 },
            { settingPath: 'audio.enabled', newValue: true },
            { settingPath: 'audio.volume', newValue: 65 },
            { settingPath: 'audio.type', newValue: 'binaural' },
          ],
        },
        description: 'Complete overhaul - ALL stimulus settings changed (11 settings)',
      },
      withManualOldValue: {
        value: {
          changes: [
            { settingPath: 'vibration.intensity', oldValue: 50, newValue: 75 },
            { settingPath: 'audio.volume', oldValue: 30, newValue: 50 },
          ],
        },
        description: 'Optional: You CAN include oldValue if you want (but not necessary)',
      },
      customEvent: {
        value: {
          patientFeedback: 'Feeling relaxed and comfortable',
          therapistNote: 'Patient responding positively to treatment',
          vitalSigns: { heartRate: 72, bloodPressure: '120/80' },
        },
        description: 'Custom metadata for non-settings events (any structure allowed)',
      },
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
