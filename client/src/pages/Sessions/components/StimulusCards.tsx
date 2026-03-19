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

  // Safety checks for undefined settings
  if (!settings || !settings.visual || !settings.tactile || !settings.audio) {
    return (
      <div className="space-y-4">
        <p className="text-center text-muted-foreground">
          No stimulus settings available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Visual */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Visual</h3>
              <p className="text-sm text-green-600">Enabled</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Color Mode: </span>
              <span className="font-medium capitalize">{settings.visual.colorMode}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Contrast: </span>
              <span className="font-medium">Level {settings.visual.contrast}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Brightness: </span>
              <span className="font-medium">Level {settings.visual.brightness}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vibration */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-50">
              <Smartphone className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Vibration</h3>
              <p className="text-sm text-green-600">Enabled</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Intensity: </span>
              <span className="font-medium">Level {settings.tactile.intensity}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pattern: </span>
              <span className="font-medium capitalize">{settings.tactile.pattern}</span>
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
              <p className="text-sm text-green-600">Enabled</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Volume: </span>
              <span className="font-medium">Level {settings.audio.volume}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Sound Type: </span>
              <span className="font-medium capitalize">{settings.audio.soundType}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
