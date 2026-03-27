import { Eye, Smartphone, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { SessionSettings } from '@/backend/session.service';

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
      {/* Vibration */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <Smartphone className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Vibration</h3>
              <p className={`text-sm ${settings.vibration?.feedback ? 'text-green-600' : 'text-gray-500'}`}>
                {settings.vibration?.feedback ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Feedback: </span>
              <span className="font-medium">{formatValue(settings.vibration?.feedback)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Intensity: </span>
              <span className="font-medium">{formatValue(settings.vibration?.intensity)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pulse Pattern: </span>
              <span className="font-medium">{formatValue(settings.vibration?.pulse)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Audio</h3>
              <p className={`text-sm ${settings.audio?.feedback ? 'text-green-600' : 'text-gray-500'}`}>
                {settings.audio?.feedback ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Feedback: </span>
              <span className="font-medium">{formatValue(settings.audio?.feedback)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Volume: </span>
              <span className="font-medium">{formatValue(settings.audio?.volume)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Sound Type: </span>
              <span className="font-medium">{formatValue(settings.audio?.sound)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Visual</h3>
              <p className={`text-sm ${settings.visual?.feedback ? 'text-green-600' : 'text-gray-500'}`}>
                {settings.visual?.feedback ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Feedback: </span>
              <span className="font-medium">{formatValue(settings.visual?.feedback)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Color: </span>
              <span className="font-medium inline-flex items-center gap-2">
                {settings.visual?.color ? (
                  <>
                    <span 
                      className="inline-block w-4 h-4 rounded border"
                      style={{ backgroundColor: settings.visual.color }}
                    />
                    {settings.visual.color}
                  </>
                ) : '—'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Brightness: </span>
              <span className="font-medium">{formatValue(settings.visual?.brightness)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Movement: </span>
              <span className="font-medium">{formatValue(settings.visual?.movement)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Speed: </span>
              <span className="font-medium">{formatValue(settings.visual?.speed)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
