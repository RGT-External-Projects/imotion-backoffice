import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon | string;
  message: string;
  className?: string;
}

export function EmptyState({ icon, message, className }: EmptyStateProps) {
  const isImageIcon = typeof icon === 'string';
  const Icon = !isImageIcon ? (icon as LucideIcon) : null;
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      {isImageIcon ? (
        <img src={icon as string} alt="" className="h-12 w-12 text-blue-400 mb-3" />
      ) : (
        Icon && <Icon className="h-12 w-12 text-blue-400 mb-3" strokeWidth={1.5} />
      )}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
