import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  userRoles: string[];
  children: React.ReactNode;
}

export function ProtectedRoute({
  allowedRoles,
  userRoles,
  children,
}: ProtectedRouteProps) {
  if (userRoles.length === 0) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (allowedRoles.length === 0) {
    return <Navigate to="/auth/forbidden" replace />;
  }

  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
  if (!hasAccess) {
    return <Navigate to="/auth/forbidden" replace />;
  }

  return <>{children}</>;
}
