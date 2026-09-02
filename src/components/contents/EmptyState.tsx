import { LucideIcon } from 'lucide-react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  variant?: 'page' | 'dialog' | 'inline';
}

export default function EmptyState({ icon: Icon, message, variant = 'page' }: EmptyStateProps) {
  return (
    <div className={`empty-state empty-state--${variant}`}>
      {Icon && <Icon size={variant === 'page' ? 48 : 40} className="empty-state__icon" />}
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
