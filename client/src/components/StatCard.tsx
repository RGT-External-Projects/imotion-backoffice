import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon | string;
  label: string;
  value: string | number;
  iconBgColor: string;
  iconColor: string;
}

export function StatCard({ icon, label, value, iconBgColor, iconColor }: StatCardProps) {
  const isImageIcon = typeof icon === 'string';
  const Icon = !isImageIcon ? (icon as LucideIcon) : null;
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg", iconBgColor)}>
            {isImageIcon ? (
              <img src={icon as string} alt={label} className={cn("h-4 w-4", iconColor)} />
            ) : (
              Icon && <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={2} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
