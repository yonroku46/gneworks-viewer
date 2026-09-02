import type { Viewport } from "next";
import { generatePageMetadata } from '@/common/utils/metaUtils';
import { Geist, Geist_Mono } from "next/font/google";
import ScrollToTop from "@/components/layout/ScrollToTop";
import MainWrapper from "@/components/layout/MainWrapper";
import { AuthProvider } from '@/providers/AuthProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import SnackbarProvider from '@/providers/SnackbarProvider';
import "@/styles/globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export const metadata = generatePageMetadata('home');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SnackbarProvider>
          <AuthProvider>
            <NotificationProvider>
              <ScrollToTop />
              <MainWrapper>
                {children}
              </MainWrapper>
            </NotificationProvider>
          </AuthProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
