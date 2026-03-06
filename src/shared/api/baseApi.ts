import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { logout, updateAccessToken } from "@/features/auth/store/authSlice";
import type { IGenericApiResponse } from "@/shared/types";
import type { ILoginResponse } from "@/features/auth/store/authApi";

const API_BASE_URL = "http://localhost:5277/api/";

// Base query with authorization header and language
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // Include cookies for refresh token
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.authData?.accessToken;
    const language = state.language?.current || "ar";

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Set Accept-Language for backend localization
    headers.set("Accept-Language", language);

    return headers;
  },
});

// Mutex to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Base query with automatic token refresh on 401 errors
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if another refresh is in progress
  if (isRefreshing && refreshPromise) {
    const refreshSucceeded = await refreshPromise;
    if (!refreshSucceeded) {
      return { error: { status: 401, data: "Session expired" } };
    }
  }

  // Make the initial request
  let result = await baseQuery(args, api, extraOptions);

  // If 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      refreshPromise = (async () => {
        try {
          // Call refresh token endpoint
          const refreshResult = await baseQuery(
            {
              url: "Auth/refresh-token",
              method: "POST",
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            const response =
              refreshResult.data as IGenericApiResponse<ILoginResponse>;

            if (response.data) {
              // Update access token in store (refresh token stays in HttpOnly cookie)
              api.dispatch(
                updateAccessToken({
                  accessToken: response.data.accessToken,
                }),
              );
              return true;
            }
          }

          // Refresh failed - logout user
          api.dispatch(logout({ silent: true }));

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/auth/sign-in";
          }

          return false;
        } catch {
          api.dispatch(logout({ silent: true }));
          return false;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();

      const refreshSucceeded = await refreshPromise;

      if (refreshSucceeded) {
        // Retry the original request with new token
        result = await baseQuery(args, api, extraOptions);
      }
    } else if (refreshPromise) {
      // Wait for ongoing refresh
      const refreshSucceeded = await refreshPromise;
      if (refreshSucceeded) {
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

/**
 * Base API for all protected endpoints
 * Other feature APIs should use baseApi.injectEndpoints()
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Person",
    "Driver",
    "Application",
    "LocalDrivingLicenseApplication",
    "License",
    "DetainedLicense",
    "Test",
    "TestAppointment",
    "LicenseClass",
    "TestType",
    "ApplicationType",
    "Country",
    "Dashboard",
  ],
  endpoints: () => ({}), // Endpoints will be injected by feature APIs
});

export default baseApi;
