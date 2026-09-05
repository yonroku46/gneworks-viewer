'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSnackbar } from 'notistack';
import AuthService from '@/api/service/AuthService';

export const servicePrefix = '/portal';
export const managePrefix = '/manage';

interface AuthContextType {
  user?: LoginUserRes;
  login: (userId: string, password: string, stayLoggedIn?: boolean) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<LoginUserRes>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginUserRes>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();

  const authPaths = ['/login'];

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage or cookie)
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (stored) {
          const authData: LoginUserRes = JSON.parse(stored);
          setUser(authData);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    };

    checkAuth();
  }, []);

  // 로그인 페이지가 아닐 때 이전 경로(prevPath) 세션 저장
  useEffect(() => {
    if (pathname && !authPaths.includes(pathname)) {
      try {
        sessionStorage.setItem('prevPath', pathname);
      } catch {
        // ignore
      }
    }
  }, [pathname]);

  const getReturnUrl = (targetUser?: LoginUserRes): string => {
    const currentUser = targetUser !== undefined ? targetUser : user;
    const isManager = Boolean(currentUser?.mngFlg);
    const defaultDestination = isManager ? `${managePrefix}/dashboard` : servicePrefix;

    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryRedirect = params.get('returnUrl') || params.get('redirect');
        if (queryRedirect && queryRedirect.startsWith('/') && !authPaths.includes(queryRedirect)) {
          if (!isManager && queryRedirect.startsWith(managePrefix)) {
            return defaultDestination;
          }
          return queryRedirect;
        }
        const returnUrl = sessionStorage.getItem('returnUrl');
        if (returnUrl && returnUrl.startsWith('/') && !authPaths.includes(returnUrl)) {
          sessionStorage.removeItem('returnUrl');
          if (!isManager && returnUrl.startsWith(managePrefix)) {
            return defaultDestination;
          }
          return returnUrl;
        }
        const prevPath = sessionStorage.getItem('prevPath');
        if (prevPath && prevPath.startsWith('/') && !authPaths.includes(prevPath) && prevPath !== '/') {
          sessionStorage.removeItem('prevPath');
          if (!isManager && prevPath.startsWith(managePrefix)) {
            return defaultDestination;
          }
          return prevPath;
        }
      } catch {
        // ignore
      }
    }
    return defaultDestination;
  };

  useEffect(() => {
    if (!isLoading && pathname) {
      const isManagePath = pathname.startsWith(managePrefix);
      const isAuthPath = authPaths.includes(pathname);

      if (!user) {
        if (isManagePath) {
          try {
            sessionStorage.setItem('returnUrl', pathname);
          } catch {
            // ignore
          }
          router.replace('/login');
        }
      } else {
        if (isAuthPath) {
          router.replace(getReturnUrl(user));
        } else if (isManagePath && !user.mngFlg) {
          enqueueSnackbar('관리자 권한이 없습니다. 작업 포탈로 이동합니다.', {
            variant: 'warning',
            preventDuplicate: true,
          });
          router.replace(servicePrefix);
        }
      }
    }
  }, [user, isLoading, pathname, router, enqueueSnackbar]);

  const login = async (userId: string, password: string, stayLoggedIn: boolean = true) => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(userId, password);
      if (res) {
        const storage = stayLoggedIn ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(res));
        setUser(res);
        const destination = getReturnUrl(res);
        router.replace(destination);
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    setUser(undefined);
    router.replace('/login');
  };

  const updateUser = (updatedData: Partial<LoginUserRes>) => {
    setUser((prev) => {
      if (!prev) return undefined;
      const nextUser = { ...prev, ...updatedData };
      try {
        if (localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(nextUser));
        }
        if (sessionStorage.getItem('currentUser')) {
          sessionStorage.setItem('currentUser', JSON.stringify(nextUser));
        }
      } catch (err) {
        console.error('Failed to update stored user:', err);
      }
      return nextUser;
    });
  };

  const isManagePath = pathname ? pathname.startsWith(managePrefix) : false;
  const isServicePath = pathname ? pathname.startsWith(servicePrefix) : false;
  const isAuthPath = pathname ? authPaths.includes(pathname) : false;
  const showLoading = (isLoading && !isAuthPath) || (!user && (isManagePath || isServicePath)) || (user && isAuthPath);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {showLoading ? (
        <div className="auth-loading-screen">
          <div className="loader"></div>
          <p>사용자 정보를 확인 중입니다...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}