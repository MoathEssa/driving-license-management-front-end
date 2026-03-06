import { localStorageService } from "@shared/lib/storage";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ILoginResponse } from "./authApi";
import { broadcast } from "@shared/lib/storage";

interface AuthSliceState {
  authData: ILoginResponse | null;
}

const initialState: AuthSliceState = {
  authData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Initialize auth from localStorage on app startup
    initializeAuth: (state, action: PayloadAction<ILoginResponse>) => {
      state.authData = action.payload;
    },
    // Set credentials after login/register
    setCredentials: (state, action: PayloadAction<ILoginResponse>) => {
      state.authData = action.payload;
      localStorageService.set<ILoginResponse>("authData", action.payload);
    },
    // Update access token after refresh (refreshToken is in HttpOnly cookie)
    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>,
    ) => {
      if (state.authData) {
        state.authData.accessToken = action.payload.accessToken;
        localStorageService.set<ILoginResponse>("authData", state.authData);
      }
    },
    // Clear auth information on logout
    logout: (
      state,
      action: PayloadAction<{ silent?: boolean } | undefined>,
    ) => {
      state.authData = null;
      localStorageService.remove("authData");
      if (!action?.payload?.silent) {
        broadcast.postMessage({ type: "LOGOUT" });
      }
    },
  },
});

export const { initializeAuth, setCredentials, updateAccessToken, logout } =
  authSlice.actions;

export default authSlice.reducer;
