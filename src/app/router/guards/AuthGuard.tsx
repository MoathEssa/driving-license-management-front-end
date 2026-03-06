import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@app/store";
import { localStorageService } from "@shared/lib/storage";
import type { ILoginResponse } from "@features/auth/store/authApi";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const userData =
    useAppSelector((state) => state.auth.authData) ||
    localStorageService.get<ILoginResponse>("authData");
  const isAuthenticated = !!userData;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/sign-in", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
