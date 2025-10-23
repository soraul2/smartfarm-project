import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import logo from "@/assets/ad8065eaf38fb6ecbe2925eea91682c28d625da3.png";
import { LogOut, MapPin, Tractor, Info, Loader2, ServerCrash } from "lucide-react";
import api from "@/api"; // Axios 인스턴스 import

interface Farm {
  id: number; // 백엔드에서 id는 Long 타입이므로 number로 변경
  name: string;
  address: string;
  description?: string; // description은 nullable 할 수 있으므로 optional로 변경
}

interface FarmListPageProps {
  onLogout: () => void;
}

export function FarmListPage({ onLogout }: FarmListPageProps) {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setLoading(true);
        const response = await api.get<Farm[]>('/api/farms');
        setFarms(response.data);
        setError(null);
      } catch (err) {
        setError('농장 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#A8D74C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#072050]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-2xl relative z-10 shadow-xl border-0 overflow-hidden">
        <Button type="button" variant="ghost" onClick={onLogout} className="text-[#6B7280] hover:text-[#DC6C4B] hover:bg-[#DC6C4B]/5 absolute top-4 right-4 p-2 h-auto text-xs">
          <LogOut className="w-4 h-4 mr-1" />
          로그아웃
        </Button> 
        <CardHeader className="space-y-3 pb-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-center space-y-1">
              <h2 className="text-[25px] font-extrabold"> {/* 여기에 text-[25px] 추가 */}
                <span className="text-[#072050]">PLANT</span>
                <span className="text-[#a85a48]">O</span>
                <span className="text-[#072050]">MANAGER</span>
              </h2>
              <p className="text-[#6B7280] text-sm">관리하실 농장을 선택해주세요</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-gray-50 rounded-lg">
              <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">농장 목록을 불러오는 중...</h3>
              <p className="mt-1 text-sm text-gray-500">잠시만 기다려주세요.</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-red-50 rounded-lg border border-red-200">
              <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-medium text-red-800">오류 발생</h3>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          ) : farms.length > 0 ? (
            <div className="space-y-3">
              {farms.map((farm) => (
                <Card
                  key={farm.id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#A8D74C] transition-all cursor-pointer group"
                  onClick={() => navigate(`/farm/${farm.id}`)}
                >
                  <CardContent className="p-4 flex items-start space-x-4">
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-[#072050] mb-1">{farm.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" /> {farm.address}</p>
                        <p className="flex items-center"><Info className="w-4 h-4 mr-2 text-gray-400" /> {farm.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 bg-gray-50 rounded-lg">
              {/* <Tractor className="mx-auto h-12 w-12 text-gray-400" /> */}
              <h3 className="mt-2 text-lg font-medium text-gray-900">등록된 농장이 없습니다</h3>
              <p className="mt-1 text-sm text-gray-500">아래 버튼을 눌러 첫 농장을 추가해보세요.</p>
            </div>
          )}
          <Button className="w-full bg-[#A8D74C] hover:bg-[#95C43A] text-white font-bold h-12 text-base" onClick={() => navigate("/add-farm")}>농장 추가하기</Button>
        </CardContent>
      </Card>
    </div>
  );
}