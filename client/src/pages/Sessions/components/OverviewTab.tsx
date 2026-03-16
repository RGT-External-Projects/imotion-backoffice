import { Eye, Smartphone, User, Calendar, Clock, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function OverviewTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Stimuli Cards */}
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

      {/* Overview Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Session ID</p>
                <p className="font-semibold">v1.2.4</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Device ID</p>
                <p className="font-semibold">D - 118</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Phone ID</p>
                <p className="font-semibold">P - 021</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Patient Code</p>
                <p className="font-semibold">Patient - 233</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Last used</p>
                <p className="font-semibold">26 Feb 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">8 minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mt-1">
                  <span className="mr-1.5">●</span>
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
