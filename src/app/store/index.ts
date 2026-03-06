import { configureStore } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { authApi } from "@features/auth/store/authApi";
import { baseApi } from "@shared/api";
import languageReducer from "./slices/languageSlice";
import authReducer from "@features/auth/store/authSlice";
import { rtkApiNotificationMiddleware } from "./middleware/rtkApiNotificationMiddleware";
import { localStorageService } from "@shared/lib/storage";
import type { ILoginResponse } from "@features/auth/store/authApi";

// Load auth data from localStorage for preloaded state
const loadAuthFromStorage = (): ILoginResponse | null => {
  return localStorageService.get<ILoginResponse>("authData");
};

const preloadedAuthData = loadAuthFromStorage();

export const store = configureStore({
  reducer: {
    // Global slices
    language: languageReducer,
    auth: authReducer,
    // API slices
    [authApi.reducerPath]: authApi.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  preloadedState: {
    auth: {
      authData: preloadedAuthData,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      rtkApiNotificationMiddleware,
      authApi.middleware,
      baseApi.middleware,
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Typed hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Auth selector helpers
export const selectAuthData = (state: RootState) => state.auth.authData;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.auth.authData;
