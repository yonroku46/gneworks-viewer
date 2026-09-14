import './AdminSiteBadge.scss';

interface Props {
  className?: string;
  label?: string;
}

export default function AdminSiteBadge({ className = '', label = '관리자용' }: Props) {
  return (
    <span className={`admin-site-badge ${className}`.trim()}>
      {label}
    </span>
  );
}
