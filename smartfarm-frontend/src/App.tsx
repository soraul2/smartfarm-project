import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { FarmListPage } from "./pages/FarmListPage";
import { FarmDetailPage } from "./pages/FarmDetailPage"; // 상세 페이지 컴포넌트 (생성 예정)
import { AddFarmPage } from "./pages/AddFarmPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute"; // 새로 만든 컴포넌트 import

// 다음 주소 API 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}

export default function App() {
  // localStorage에서 로그인 상태를 읽어와 초기값으로 설정
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // isLoggedIn 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken"); // 로그아웃 시 토큰 삭제
  };

  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/farms" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 인증이 필요한 라우트들을 ProtectedRoute로 감싸줍니다. */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/farms" element={<FarmListPage onLogout={handleLogout} />} />
          <Route path="/add-farm" element={<AddFarmPage onLogout={handleLogout} />} />
          <Route path="/farm/:farmId" element={<FarmDetailPage onLogout={handleLogout} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
