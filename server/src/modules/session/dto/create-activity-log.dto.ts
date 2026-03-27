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
    description: '⚠️ MOBILE APP: DO NOT send this field for SETTINGS_CHANGED events! Backend auto-generates beautiful descriptions. Only send for custom events.',
    example: 'Custom event description for non-settings events',
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

Available Setting Paths (provided by mobile team):
  VIBRATION STIMULUS:
    - vibration.feedback (boolean) - Enable/disable haptic feedback
    - vibration.intensity (number, 0-100) - Vibration strength level
    - vibration.pulse (string) - Pulse pattern (e.g., "steady", "pulsing", "wave")
  
  AUDIO STIMULUS:
    - audio.feedback (boolean) - Enable/disable audio feedback
    - audio.volume (number, 0-100) - Audio volume level
    - audio.sound (string) - Sound type (e.g., "binaural", "white-noise", "nature")
  
  VISUAL STIMULUS:
    - visual.feedback (boolean) - Enable/disable visual feedback
    - visual.color (string) - Hex color code (e.g., "#FF0000", "#00FF00")
    - visual.brightness (number, 0-100) - Screen brightness level
    - visual.movement (string) - Movement pattern (e.g., "circular", "linear", "random")
    - visual.speed (number, 0-100) - Animation speed`,
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
            { settingPath: 'visual.feedback', newValue: true },
            { settingPath: 'visual.color', newValue: '#00FF00' },
            { settingPath: 'visual.brightness', newValue: 80 },
            { settingPath: 'visual.speed', newValue: 70 },
            { settingPath: 'visual.movement', newValue: 'circular' },
          ],
        },
        description: 'Change ALL visual stimulus settings at once',
      },
      allVibrationSettings: {
        value: {
          changes: [
            { settingPath: 'vibration.feedback', newValue: true },
            { settingPath: 'vibration.intensity', newValue: 80 },
            { settingPath: 'vibration.pulse', newValue: 'pulsing' },
          ],
        },
        description: 'Change ALL vibration stimulus settings at once',
      },
      allAudioSettings: {
        value: {
          changes: [
            { settingPath: 'audio.feedback', newValue: true },
            { settingPath: 'audio.volume', newValue: 60 },
            { settingPath: 'audio.sound', newValue: 'binaural' },
          ],
        },
        description: 'Change ALL audio stimulus settings at once',
      },
      visualAndVibration: {
        value: {
          changes: [
            { settingPath: 'visual.feedback', newValue: true },
            { settingPath: 'visual.speed', newValue: 85 },
            { settingPath: 'visual.brightness', newValue: 75 },
            { settingPath: 'vibration.feedback', newValue: true },
            { settingPath: 'vibration.intensity', newValue: 90 },
          ],
        },
        description: 'Enable and adjust visual + vibration together',
      },
      vibrationAndAudio: {
        value: {
          changes: [
            { settingPath: 'vibration.feedback', newValue: true },
            { settingPath: 'vibration.intensity', newValue: 65 },
            { settingPath: 'audio.feedback', newValue: true },
            { settingPath: 'audio.volume', newValue: 55 },
            { settingPath: 'audio.sound', newValue: 'white-noise' },
          ],
        },
        description: 'Enable and adjust vibration + audio together',
      },
      visualAndAudio: {
        value: {
          changes: [
            { settingPath: 'visual.feedback', newValue: true },
            { settingPath: 'visual.color', newValue: '#FF00FF' },
            { settingPath: 'visual.brightness', newValue: 85 },
            { settingPath: 'audio.feedback', newValue: true },
            { settingPath: 'audio.volume', newValue: 70 },
          ],
        },
        description: 'Enable and adjust visual + audio together',
      },
      allStimuliComplete: {
        value: {
          changes: [
            { settingPath: 'vibration.feedback', newValue: true },
            { settingPath: 'vibration.intensity', newValue: 85 },
            { settingPath: 'vibration.pulse', newValue: 'pulsing' },
            { settingPath: 'audio.feedback', newValue: true },
            { settingPath: 'audio.volume', newValue: 65 },
            { settingPath: 'audio.sound', newValue: 'binaural' },
            { settingPath: 'visual.feedback', newValue: true },
            { settingPath: 'visual.color', newValue: '#0000FF' },
            { settingPath: 'visual.brightness', newValue: 90 },
            { settingPath: 'visual.movement', newValue: 'circular' },
            { settingPath: 'visual.speed', newValue: 70 },
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
