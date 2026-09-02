'use client';

import { useMemo } from 'react';
import { Bell, User } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { useNotification } from '@/providers/NotificationProvider';
import './NotificationList.scss';

dayjs.locale('ko');

const NotificationList = () => {
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
              {items.map((item) => (
                <div 
                  key={item.appNotificationId} 
                  className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                  onClick={() => markAsRead(item.appNotificationId)}
                >
                  <div className="icon-area">
                    {item.iconType === 'LOGO' ? (
                      <Bell className="logo-icon" />
                    ) : (
                      <div className="default-avatar">
                        <User size={24} />
                      </div>
                    )}
                  </div>
                  <div className="content-area">
                    <div className="header-row">
                      <div className="title-group">
                        <span className="item-title">{item.title}</span>
                        <span className="item-time">{dayjs(item.createTime).format('A h:mm')}</span>
                      </div>
                    </div>
                    <p className="item-message">{item.message}</p>
                    {item.centerName && <span className="item-footer">{item.centerName}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationList;
