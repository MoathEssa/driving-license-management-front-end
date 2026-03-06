// src/features/auth/store/authApi.ts
import type { IGenericApiResponse } from "@shared/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ==================== DTOs ====================

export interface ILoginRequestDTO {
  email: string;
  password: string;
}

export interface IRegisterRequestDTO {
  nationalNo: string;
  firstName: string;
  secondName: string;
  thirdName: string;
  lastName: string;
  dateOfBirth: string;
  gender: number; // 0=Male, 1=Female
  email: string;
  password: string;
  confirmPassword: string;
}

// What backend sends in LoginResponse.User
export interface IAuthUser {
  userId: number;
  email: string;
  fullName: string;
  roles: string[];
}

// Full login response (access token + user info)
// Note: refreshToken is stored in HttpOnly cookie by backend (not in response body)
export interface ILoginResponse {
  user: IAuthUser;
  accessToken: string;
}

// GET /me response
export interface ICurrentUserResponse {
  userId: number;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface ISetPasswordRequest {
  userId: number;
  token: string;
  password: string;
  confirmPassword: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

// ==================== API ====================

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5277/api/Auth/",
    credentials: "include", // Include cookies for refresh token
  }),
  endpoints: (builder) => ({
    register: builder.mutation<
      IGenericApiResponse<ILoginResponse>,
      IRegisterRequestDTO
    >({
      query: (body) => ({
        url: "register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<
      IGenericApiResponse<ILoginResponse>,
      ILoginRequestDTO
    >({
      query: (body) => ({
        url: "login",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<IGenericApiResponse<ILoginResponse>, void>({
      query: () => ({
        url: "refresh-token",
        method: "POST",
      }),
    }),
    logout: builder.mutation<IGenericApiResponse<string>, void>({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    setPassword: builder.mutation<
      IGenericApiResponse<string>,
      ISetPasswordRequest
    >({
      query: (body) => ({
        url: "set-password",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<
      IGenericApiResponse<string>,
      IForgotPasswordRequest
    >({
      query: (body) => ({
        url: "forgot-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useSetPasswordMutation,
  useForgotPasswordMutation,
} = authApi;
