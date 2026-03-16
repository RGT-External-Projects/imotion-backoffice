import { Eye, Smartphone, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StimulusCards() {
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
              <span className="text-muted-foreground">Color: </span>
              <span className="font-medium">Blue</span>
            </div>
            <div>
              <span className="text-muted-foreground">Speed: </span>
              <span className="font-medium">Level 13</span>
            </div>
            <div>
              <span className="text-muted-foreground">Movement: </span>
              <span className="font-medium">Flow</span>
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
              <span className="font-medium">Level 4</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pulse: </span>
              <span className="font-medium">continuous</span>
            </div>
            <div>
              <span className="text-muted-foreground">Speed: </span>
              <span className="font-medium">Level 13</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gray-50">
              <Activity className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold">Audio</h3>
              <p className="text-sm text-gray-600">Disabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
