import { Card, CardContent } from '@/components/ui/card';
import type { SessionSettings } from '@/backend/session.service';
import EyeIcon from '@/assets/icons/EyeIcon';
import VibrationIcon from '@/assets/icons/VibrationIcon';
import AudioIcon from '@/assets/icons/AudioIcon';

interface StimulusCardsProps {
  initialSettings: SessionSettings;
  finalSettings?: SessionSettings;
}

export function StimulusCards({ initialSettings, finalSettings }: StimulusCardsProps) {
  // Use final settings if available, otherwise use initial settings
  const settings = finalSettings || initialSettings;

  // Safety check
  if (!settings) {
    return (
      <div className="space-y-4">
        <p className="text-center text-muted-foreground">
          No stimulus settings available
        </p>
      </div>
    );
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Enabled' : 'Disabled';
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') {
      if (value.startsWith('#')) return value; // Color hex
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return String(value);
  };

  return (
    <div className="space-y-4">
      {/* Visual */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-slate-100 flex items-center justify-center">
              <EyeIcon size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Visual</h3>
              <p className={`text-sm ${settings.visual?.feedback ? 'text-green-600' : 'text-gray-500'}`}>
                {settings.visual?.feedback ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Feedback:</span>
              <span className="font-medium">{formatValue(settings.visual?.feedback)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Color:</span>
              <span className="font-medium inline-flex items-center gap-2">
                {settings.visual?.color ? (
                  <>
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{ backgroundColor: settings.visual.color }}
                    />
                    {settings.visual.color}
                  </>
                ) : '—'}
              </span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Brightness:</span>
              <span className="font-medium">{formatValue(settings.visual?.brightness)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Movement:</span>
              <span className="font-medium">{formatValue(settings.visual?.movement)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Speed:</span>
              <span className="font-medium">{formatValue(settings.visual?.speed)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vibration */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-slate-100 flex items-center justify-center">
              <VibrationIcon size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Vibration</h3>
              <p className={`text-sm ${settings.vibration?.feedback ? 'text-green-600' : 'text-gray-500'}`}>
                {settings.vibration?.feedback ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Feedback:</span>
              <span className="font-medium">{formatValue(settings.vibration?.feedback)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Intensity:</span>
              <span className="font-medium">{formatValue(settings.vibration?.intensity)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Pulse:</span>
              <span className="font-medium">{formatValue(settings.vibration?.pulse)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-xl bg-slate-100 flex items-center justify-center">
              <AudioIcon size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Audio</h3>
              <p className={`text-sm ${settings.audio?.feedback ? 'text-green-600' : 'text-gray-500'}`}>
                {settings.audio?.feedback ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Feedback:</span>
              <span className="font-medium">{formatValue(settings.audio?.feedback)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Volume:</span>
              <span className="font-medium">{formatValue(settings.audio?.volume)}</span>
            </div>
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
              <span className="text-muted-foreground mr-1">Sound:</span>
              <span className="font-medium">{formatValue(settings.audio?.sound)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
