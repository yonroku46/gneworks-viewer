import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const tokenPrefix = 'Bearer';
const isClient = typeof window !== 'undefined';

const ApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 응답 인터셉터: response.data 언래핑 및 에러 처리
ApiInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    let message = '요청 처리 중 오류가 발생했습니다.';
    
    if (error.response) {
      // 서버가 응답을 반환한 경우 (2xx 외의 상태 코드)
      const data = error.response.data as any;
      const status = error.response.status;

      // 1. 서버에서 전달한 에러 메시지가 있는지 확인 (BaseResponse 구조 가정)
      if (data?.info?.message) {
        message = data.info.message;
      } else {
        // 2. 상태 코드별 기본 한국어 메시지
        switch (status) {
          case 400:
            message = '잘못된 요청입니다. 입력값을 확인해주세요.';
            break;
          case 401:
            message = '로그인이 필요하거나 세션이 만료되었습니다.';
            if (typeof window !== 'undefined') {
              localStorage.removeItem('currentUser');
              sessionStorage.removeItem('currentUser');
              // 이미 로그인 페이지가 아닌 경우에만 리다이렉트 (무한 루프 방지)
              if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
              }
            }
            break;
          case 403:
            message = '접근 권한이 없습니다.';
            break;
          case 404:
            message = '요청하신 리소스를 찾을 수 없습니다.';
            break;
          case 429:
            message = '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            message = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            message = `오류가 발생했습니다. (상태 코드: ${status})`;
        }
      }
    } else if (error.request) {
      // 요청은 전달되었으나 응답을 받지 못한 경우 (네트워크 오류 등)
      message = '서버와 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      message = error.message;
    }

    // 에러 객체의 message를 사용자 친화적인 메시지로 교체
    error.message = message;
    
    return Promise.reject(error);
  }
);

if (isClient) {
  // 요청 인터셉터: localStorage의 토큰을 Authorization 헤더에 주입
  ApiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      try {
        const raw = localStorage.getItem('currentUser');
        if (raw) {
          const user = JSON.parse(raw);
          if (user?.token) {
            config.headers['Authorization'] = `${tokenPrefix} ${user.token}`;
          }
          if (user?.refreshToken) {
            config.headers['RefreshToken'] = `${tokenPrefix} ${user.refreshToken}`;
          }
        }
      } catch {
        // 파싱 실패 시 무시
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
}

export default ApiInstance;
