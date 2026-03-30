import * as React from 'react';
import { cn } from '@/lib/utils';

export interface StatusPillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional leading icon element */
  icon?: React.ReactNode;
}

/**
 * Reusable status pill button used for things like "Completed" chips.
 * Renders a <button> so you can attach onClick handlers later.
 */
export const StatusPill: React.FC<StatusPillProps> = ({
  icon,
  children,
  className,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm px-6 py-2.5 text-sm font-medium border-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2F7D4A]',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};
