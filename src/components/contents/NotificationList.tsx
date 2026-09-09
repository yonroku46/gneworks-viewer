'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { useNotification } from '@/providers/NotificationProvider';
import './NotificationList.scss';

dayjs.locale('ko');

interface NotificationListProps {
  onClose?: () => void;
}

const parseNotificationMessage = (rawMessage?: string) => {
  if (!rawMessage) return { text: '', url: null };
  const linkMatch = rawMessage.match(/<!--link:(.*?)-->/);
  const url = linkMatch ? linkMatch[1] : null;
  const text = rawMessage.replace(/\n?<!--link:.*?-->/g, '').trim();
  return { text, url };
};

const NotificationList = ({ onClose }: NotificationListProps) => {
  const router = useRouter();
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotification();

  // Group and sort notifications
  const sortedGroupedNotifications = useMemo(() => {
    const parseDate = (dateStr: string) => {
      const match = dateStr.match(/(\d+)년 (\d+)월 (\d+)일/);
      if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
      }
      return dateStr;
    };

    const sorted = [...notifications].sort((a, b) => 
      dayjs(b.createTime).unix() - dayjs(a.createTime).unix()
    );

    const groups = sorted.reduce((acc, n) => {
      const date = dayjs(n.createTime).format('YYYY년 MM월 DD일');
      if (!acc[date]) acc[date] = [];
      acc[date].push(n);
      return acc;
    }, {} as Record<string, AppNotification[]>);

    return Object.entries(groups).sort((a, b) => 
      dayjs(parseDate(b[0])).unix() - dayjs(parseDate(a[0])).unix()
    );
  }, [notifications]);

  const getDisplayDate = (fullDate: string) => {
    const parseDate = (dateStr: string) => {
      const match = dateStr.match(/(\d+)년 (\d+)월 (\d+)일/);
      if (match) return `${match[1]}-${match[2]}-${match[3]}`;
      return dateStr;
    };
    
    const targetDate = dayjs(parseDate(fullDate));
    const today = dayjs();
    
    if (targetDate.isSame(today, 'day')) return '오늘';
    if (targetDate.isSame(today.subtract(1, 'day'), 'day')) return '어제';
    return targetDate.format('M월 D일');
  };

  const handleItemClick = (item: AppNotification) => {
    markAsRead(item.appNotificationId);

    const { url } = parseNotificationMessage(item.message);
    let targetUrl = url;
    if (!targetUrl) {
      if (item.title?.includes('보고서') || item.message?.includes('보고서')) {
        targetUrl = '/manage/work';
      } else if (item.title?.includes('문의') || item.message?.includes('문의')) {
        targetUrl = '/manage/inquiries';
      }
    }

    if (targetUrl) {
      onClose?.();
      router.push(targetUrl);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="notification-list">
      {notifications.length > 0 && (
        <div className="list-header">
          <button className="mark-all-read" onClick={markAllAsRead}>모두 읽음으로 표시</button>
        </div>
      )}

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} message="수신된 알림이 없습니다." />
      ) : (
        sortedGroupedNotifications.map(([date, items]) => (
          <div key={date} className="date-group">
            <h3 className="group-date">{getDisplayDate(date)}</h3>
            <div className="notification-items">
              {items.map((item) => {
                const { text: cleanMessage } = parseNotificationMessage(item.message);
                return (
                  <div 
                    key={item.appNotificationId} 
                    className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                    onClick={() => handleItemClick(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={`icon-area ${item.iconType === 'LOGO' ? 'is-logo' : 'is-user'}`}>
                      {item.iconType === 'LOGO' ? (
                        <Bell size={15} />
                      ) : (
                        <User size={15} />
                      )}
                    </div>
                    <div className="content-area">
                      <div className="header-row">
                        <div className="title-group">
                          <span className="item-title">{item.title}</span>
                          <span className="item-time">{dayjs(item.createTime).format('A h:mm')}</span>
                        </div>
                      </div>
                      <p className="item-message">{cleanMessage}</p>
                      {item.centerName && <span className="item-footer">{item.centerName}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
