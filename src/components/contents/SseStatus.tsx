'use client';

import { useNotification } from '@/providers/NotificationProvider';
import { Wifi, WifiOff } from 'lucide-react';
import './SseStatus.scss';

export default function SseStatus() {
  const { sseStatus } = useNotification();

  const getStatusConfig = () => {
    switch (sseStatus) {
      case 'connected':
        return { 
          icon: <Wifi size={14} />, 
          text: '알림 수신중', 
          className: 'status--connected' 
        };
      case 'connecting':
        return { 
          icon: <Wifi size={14} />, 
          text: '연결 중...', 
          className: 'status--connecting' 
        };
      case 'error':
        return { 
          icon: <WifiOff size={14} />, 
          text: '연결 오류', 
          className: 'status--error' 
        };
      default:
        return { 
          icon: <WifiOff size={14} />, 
          text: '연결 안됨', 
          className: 'status--disconnected' 
        };
    }
  };

  const { icon, text, className } = getStatusConfig();

  return (
    <div className={`sse-status ${className}`} title={text}>
      {icon}
      <span className="status-text">{text}</span>
    </div>
  );
}
