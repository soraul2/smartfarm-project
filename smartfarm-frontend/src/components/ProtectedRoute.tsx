// src/components/ProtectedRoute.tsx (새 파일)

import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
}

export function ProtectedRoute({ isLoggedIn }: ProtectedRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
