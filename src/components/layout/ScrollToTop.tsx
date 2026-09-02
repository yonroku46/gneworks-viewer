'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const contentArea = document.querySelector('.content-area');
    if (contentArea) {
      contentArea.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
