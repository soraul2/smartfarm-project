import { useState, useEffect } from 'react'; // React의 상태(state)와 생명주기(lifecycle) 훅 import
import { useParams, useNavigate } from 'react-router-dom'; // URL 파라미터 읽기 및 페이지 이동 훅 import
import axios from 'axios'; // HTTP 요청을 보내기 위한 라이브러리 import
import { toast } from 'sonner'; // 사용자에게 알림 메시지를 보여주는 라이브러리 import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // UI 카드 컴포넌트 import (Shadcn/ui 가정)
import { ArrowLeft, HardDrive, LogOut } from 'lucide-react'; // 아이콘 컴포넌트 import
import { Button } from '@/components/ui/button'; // UI 버튼 컴포넌트 import

// Device 타입 정의: 백엔드 API 응답의 디바이스 객체 구조와 일치해야 합니다.
interface Device {
  id: number;          // 디바이스 고유 ID
  serial: string;      // 디바이스 시리얼 번호
  description: string; // 디바이스 설명
}

// Farm 상세 정보 타입 정의: 백엔드 API 응답의 농장 상세 정보 구조와 일치해야 합니다.
interface FarmDetail {
  id: number;             // 농장 고유 ID
  name: string;           // 농장 이름
  address: string;        // 농장 주소
  detailedAddress: string;// 농장 상세 주소
  description: string;    // 농장 설명
  devices: Device[];      // 해당 농장에 속한 디바이스 목록 (Device 타입의 배열)
}

// FarmDetailPage 컴포넌트가 받을 props 타입 정의
interface FarmDetailPageProps {
  onLogout: () => void;
}

// FarmDetailPage 컴포넌트 정의
export function FarmDetailPage({ onLogout }: FarmDetailPageProps) {
  const navigate = useNavigate(); // 페이지 이동 함수 가져오기
  const { farmId } = useParams<{ farmId: string }>(); // URL 경로에서 ':farmId' 부분의 값을 가져오기 (예: /farms/1 이면 '1')
  const [farm, setFarm] = useState<FarmDetail | null>(null); // 농장 상세 정보를 저장할 상태 변수 (초기값 null)
  const [loading, setLoading] = useState(true); // 데이터 로딩 중인지 여부를 저장할 상태 변수 (초기값 true)
  const [error, setError] = useState<string | null>(null); // 에러 메시지를 저장할 상태 변수 (초기값 null)

  // 컴포넌트가 마운트되거나 farmId가 변경될 때 실행되는 효과(Effect) 훅
  useEffect(() => {
    // 농장 상세 정보를 비동기적으로 가져오는 함수
    const fetchFarmDetail = async () => {
      // URL 파라미터에서 farmId를 제대로 가져오지 못했으면 함수 종료
      if (!farmId) return;

      // localStorage에서 인증 토큰(로그인 시 저장한 토큰) 가져오기
      const token = localStorage.getItem('authToken');
      // 토큰이 없으면 로그인 필요 알림 후 로그인 페이지로 이동
      if (!token) {
        toast.error('로그인이 필요합니다.');
        navigate('/auth');
        return;
      }

      // API 호출 시작 전 로딩 상태 활성화 및 이전 에러 초기화
      setLoading(true);
      setError(null);

      try {
        // 백엔드 API 호출: GET /api/farms/{farmId} (프록시 사용 가정)
        // 요청 헤더에 Authorization으로 Bearer 토큰 추가
        const response = await axios.get<FarmDetail>(`/api/farms/${farmId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // API 호출 성공 시, 응답 데이터를 farm 상태 변수에 저장
        setFarm(response.data);
      } catch (err) {
        // API 호출 실패 시, 콘솔에 에러 로그 출력 및 에러 상태 업데이트
        console.error("농장 상세 정보 로딩 실패:", err);
        setError("농장 정보를 불러오는데 실패했습니다.");
        toast.error("농장 정보를 불러오는데 실패했습니다.");
      } finally {
        // API 호출 성공/실패 여부와 관계없이 로딩 상태 비활성화
        setLoading(false);
      }
    };

    // 정의한 비동기 함수 실행
    fetchFarmDetail();
  }, [farmId, navigate]); // farmId나 navigate 함수가 변경될 때마다 이 useEffect 훅 재실행

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <div className="p-4">로딩 중...</div>;
  }

  // 에러가 발생했거나 farm 데이터를 받아오지 못했을 때 표시할 UI
  if (error || !farm) {
    return <div className="p-4 text-red-500">{error || "농장 정보를 찾을 수 없습니다."}</div>;
  }

  // 로딩과 에러 처리가 끝나고 정상적으로 farm 데이터를 받아왔을 때 렌더링될 UI
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#A8D74C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#072050]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-2xl relative z-10 shadow-xl border-0">
        <CardHeader className="pb-4">
          <Button type="button" variant="ghost" onClick={() => navigate("/farms")} className="text-[#6B7280] hover:text-[#A8D74C] hover:bg-[#A8D74C]/5 absolute top-4 left-4 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button type="button" variant="ghost" onClick={onLogout} className="text-[#6B7280] hover:text-[#DC6C4B] hover:bg-[#DC6C4B]/5 absolute top-4 right-4 p-2 h-auto text-xs">
            <LogOut className="w-4 h-4 mr-1" />
            로그아웃
          </Button>
          <div className="text-center pt-12">
            <CardTitle className="text-2xl font-bold text-[#072050]">{farm.name}</CardTitle>
            <CardDescription className="mt-1">{farm.address} {farm.detailedAddress}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#072050] mb-4">디바이스 목록</h3>
            {/* farm 객체의 devices 배열 길이가 0이면 "등록된 디바이스 없음" 메시지 표시 */}
            {farm.devices.length === 0 ? (
              <div className="text-center py-12 px-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">등록된 디바이스가 없습니다.</p>
              </div>
            ) : (
              // devices 배열에 항목이 있으면, 각 디바이스를 목록(ul) 형태로 렌더링
              <ul className="space-y-3">
                {/* devices 배열을 map 함수로 순회하며 각 device 객체를 li 태그로 변환 */}
                {farm.devices.map((device) => (
                  // 각 목록 항목(li)은 고유한 key prop (device.id)을 가져야 함
                  <li key={device.id} className="flex items-center p-4 border rounded-lg bg-white shadow-sm">
                    {/* 디바이스 아이콘 */}
                    <HardDrive className="w-5 h-5 mr-4 text-gray-500" />
                    <div className="flex-grow">
                      {/* 디바이스 시리얼 번호 표시 */}
                      <span className="font-semibold text-gray-800">{device.serial}</span>
                      {/* 디바이스 설명 표시 */}
                      <p className="text-sm text-gray-600">{device.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
      </Card>
    </div>
  );
}