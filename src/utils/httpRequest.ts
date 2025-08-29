import axios from "axios";
import cookieUtil from "./cookieUtil";
import { refreshTokenRequest } from "@/services/auth";
import { lang } from "@/lib/utils";

export const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: "https://datn.tran-van-canh.io.vn/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const handlerRequest = async <T>(promise: Promise<{ data: T }>) => {
  return promise.then((res) => [undefined, res.data] as const).catch((err) => [err, undefined] as const);
};

// all req has header
httpRequest.interceptors.request.use(
  (config) => {
    const accessToken = cookieUtil.getStorage()?.accessToken;
    const publicRoutes = [
      "/auth/login",
      "/auth/logout",
      "/auth/refresh-token",
      "/auth/register",
      "/auth/login/oauth2/google/authentication/**",
    ];
    if (accessToken && !publicRoutes.some((route) => config.url?.includes(route))) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      const language = lang === "vi-VN" ? "vi" : "en";
      config.headers["Accept-Language"] = language;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const getRefreshToken = cookieUtil.getStorage()?.refreshToken;

    if (error.response?.data?.code === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!getRefreshToken) {
          throw new Error("No refresh token available");
        }

        const [refreshError, refreshData] = await refreshTokenRequest();

        if (refreshError) {
          cookieUtil.deleteStorage();
          return Promise.reject(refreshError);
        }

        const { accessToken, refreshToken } = refreshData.data;
        const dataStorage = {
          accessToken,
          refreshToken,
        };
        cookieUtil.setStorage(dataStorage);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return httpRequest(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
