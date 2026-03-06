import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { localStorageService, broadcast } from "@shared/lib/storage";
import { setCredentials, logout } from "@features/auth/store/authSlice";
import type { ILoginResponse } from "@features/auth/store/authApi";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    const authData = localStorageService.get<ILoginResponse>("authData");
    if (authData) {
      dispatch(setCredentials(authData));
    }
  }, [dispatch]);

  // Listen for logout broadcasts from other tabs
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "LOGOUT") {
        dispatch(logout({ silent: true }));
      }
    };

    broadcast.addEventListener("message", handler);
    return () => {
      broadcast.removeEventListener("message", handler);
    };
  }, [dispatch]);

  return <>{children}</>;
}
