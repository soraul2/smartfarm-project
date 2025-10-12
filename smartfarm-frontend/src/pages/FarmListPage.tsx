import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import logo from "@/assets/ad8065eaf38fb6ecbe2925eea91682c28d625da3.png";
import { LogOut, MapPin, Tractor, Info } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  address: string;
  description: string;
}

interface FarmListPageProps {
  farms: Farm[];
  onLogout: () => void;
}

export function FarmListPage({ farms, onLogout }: FarmListPageProps) {
  const navigate = useNavigate();

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
          <div className="flex flex-col items-center space-y-3">
            <ImageWithFallback src={logo} alt="PlantOMars Logo" className="w-16 h-16 object-contain" />
            <div className="text-center space-y-1">
              <h2>
                <span className="text-[#072050]">PLANT</span><span className="text-[#A8D74C]">O</span><span className="text-[#072050]">MANAGER</span>
              </h2>
              <p className="text-[#6B7280] text-sm">관리하실 농장을 선택해주세요</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {farms.length > 0 ? (
            <div className="space-y-3">
              {farms.map((farm) => (
                <Card
                  key={farm.id}
                  className="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#A8D74C] transition-all cursor-pointer group"
                  onClick={() => console.log("농장 관리:", farm.id)}
                >
                  <CardContent className="p-4 flex items-start space-x-4">
                    <div className="mt-1 flex-shrink-0">
                      <Tractor className="w-6 h-6 text-[#A8D74C] group-hover:scale-110 transition-transform" />
                    </div>
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
              <Tractor className="mx-auto h-12 w-12 text-gray-400" />
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