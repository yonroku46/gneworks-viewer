'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';

interface MainWrapperProps {
  children: React.ReactNode;
}

export default function MainWrapper({ children }: MainWrapperProps) {
  const pathname = usePathname();
  const isPortal = pathname ? pathname.startsWith('/portal') : false;

  return (
    <main className={isPortal ? 'service-main' : 'public-main'}>
      <div className="content-area">
        {isPortal && <Header />}
        {children}
      </div>
      {isPortal && <BottomNav />}
      <div id="dialog-root" />
    </main>
  );
}
