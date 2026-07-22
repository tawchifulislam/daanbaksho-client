import axios from 'axios';

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

axiosSecure.interceptors.request.use(config => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosSecure.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem('access-token');

      const isAuthPage =
        typeof window !== 'undefined' &&
        ['/login', '/register'].includes(window.location.pathname);

      // Only redirect if we're not already on an auth page -
      // this is what breaks the infinite reload loop.
      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
