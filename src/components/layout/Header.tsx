'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import SlideDialog from '@/components/dialog/SlideDialog';
import NotificationList from '@/components/contents/NotificationList';
import SseStatus from '@/components/contents/SseStatus';
import { servicePrefix } from '@/providers/AuthProvider';
import { useNotification } from '@/providers/NotificationProvider';
import './Header.scss';

const Header = () => {
  const pathname = usePathname();
  const { unreadCount } = useNotification();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const getPageConfig = (path: string) => {
    switch (path) {
      case `${servicePrefix}`:
        return { title: '작업 포탈' };
      case `${servicePrefix}/lounge`:
        return { title: '라운지' };
      case `${servicePrefix}/reserve`:
        return { title: '수업예약' };
      case `${servicePrefix}/profile`:
        return { title: '마이페이지' };
      case `${servicePrefix}/notice`:
        return { title: '공지사항' };
      default:
        return { title: '' };
    }
  };

  const { title } = getPageConfig(pathname);

  if (!title) return null;

  return (
    <>
      <header className="header">
        <h1 className="title">{title}</h1>
        <div className="header-actions">
          <button className="action-btn" onClick={() => setIsNotificationOpen(true)} title="알림 확인">
            <Bell size={22} />
            {unreadCount > 0 && <span className="unread-dot" />}
          </button>
        </div>
      </header>

      <SlideDialog
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        title="알림"
        rightElement={<SseStatus />}
        noPadding
      >
        <NotificationList />
      </SlideDialog>
    </>
  );
};

export default Header;
