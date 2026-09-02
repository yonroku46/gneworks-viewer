'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, User } from 'lucide-react';
import { servicePrefix } from '@/providers/AuthProvider';
import './BottomNav.scss';

const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { label: '작업목록', icon: ClipboardList, href: `${servicePrefix}/work` },
    { label: '홈', icon: Home, href: `${servicePrefix}` },
    { label: '마이페이지', icon: User, href: `${servicePrefix}/profile` },
  ];

  if (!pathname || !pathname.startsWith(servicePrefix)) return null;

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon className="icon" strokeWidth={isActive ? 2.5 : 2} />
            <span className="label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
