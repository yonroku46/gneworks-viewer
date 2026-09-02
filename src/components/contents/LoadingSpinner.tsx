import { Loader2 } from 'lucide-react';
import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  size?: number;
  variant?: 'page' | 'section';
}

export default function LoadingSpinner({ size = 28, variant = 'page' }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner--${variant}`}>
      <Loader2 size={size} className="loading-spinner__icon" />
    </div>
  );
}
