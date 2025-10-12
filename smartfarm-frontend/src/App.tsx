import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { FarmListPage } from "./pages/FarmListPage";
import { AddFarmPage } from "./pages/AddFarmPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./components/ProtectedRoute"; // 새로 만든 컴포넌트 import
import { v4 as uuidv4 } from 'uuid'; // uuid 라이브러리 import

// 다음 주소 API 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}

interface Farm {
  id: string;
  name: string;
  address: string;
  description: string;
}

export default function App() {
  // localStorage에서 로그인 상태를 읽어와 초기값으로 설정
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [farms, setFarms] = useState<Farm[]>([]);

  // isLoggedIn 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
    if (!isLoggedIn) {
      // 로그아웃 시 농장 목록 초기화
      setFarms([]);
    }
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddFarm = (newFarm: Omit<Farm, 'id'>) => {
    // uuid를 사용하여 고유 ID 생성
    const farmWithId = { ...newFarm, id: uuidv4() };
    setFarms(prevFarms => [...prevFarms, farmWithId]);
  };

  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/farms" /> : <AuthPage onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* 인증이 필요한 라우트들을 ProtectedRoute로 감싸줍니다. */}
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/farms" element={<FarmListPage farms={farms} onLogout={handleLogout} />} />
          <Route path="/add-farm" element={<AddFarmPage onAddFarm={handleAddFarm} onLogout={handleLogout} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
