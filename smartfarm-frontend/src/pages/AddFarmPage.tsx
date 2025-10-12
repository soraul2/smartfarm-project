import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import logo from "@/assets/ad8065eaf38fb6ecbe2925eea91682c28d625da3.png"; 
import { ArrowLeft, Plus, X, Search, LogOut } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  address: string;
  description: string;
}

interface AddFarmPageProps {
  onAddFarm: (newFarm: Omit<Farm, 'id'>) => void;
  onLogout: () => void;
}

export function AddFarmPage({ onAddFarm, onLogout }: AddFarmPageProps) {
  const navigate = useNavigate();

  const [farmData, setFarmData] = useState({ name: "", address: "", detailAddress: "", description: "" });
  const [devices, setDevices] = useState<{ serial: string; description: string; verified: boolean }[]>([{ serial: "", description: "", verified: false }]);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [deviceCheckDialog, setDeviceCheckDialog] = useState<{ open: boolean; index: number; exists: boolean }>({ open: false, index: -1, exists: false });
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const openAddressDialog = () => {
    setIsAddressDialogOpen(true);
    setTimeout(() => {
      if (window.daum && window.daum.Postcode) {
        const element = document.getElementById('daum-postcode-container');
        if (element) {
          element.innerHTML = '';
          new window.daum.Postcode({
            oncomplete: function (data: any) {
              const fullAddress = data.roadAddress || data.jibunAddress;
              setFarmData({ ...farmData, address: fullAddress });
              setIsAddressDialogOpen(false);
            },
            width: '100%',
            height: '100%',
            autoMapping: true
          }).embed(element);
        }
      }
    }, 100);
  };

  const handleAddDevice = () => setDevices([...devices, { serial: "", description: "", verified: false }]);
  const handleRemoveDevice = (index: number) => {
    if (devices.length > 1) setDevices(devices.filter((_, i) => i !== index));
  };
  const handleDeviceChange = (index: number, field: 'serial' | 'description', value: string) => {
    const newDevices = [...devices];
    newDevices[index][field] = value;
    setDevices(newDevices);
  };

  const handleDeviceCheck = (index: number) => {
    const serial = devices[index].serial.trim();
    if (!serial) {
      setErrorDialog({ open: true, message: "디바이스 시리얼을 입력해주세요." });
      return;
    }
    const validSerials = ["ADMIN1", "ADMIN2", "ADMIN3"];
    const exists = validSerials.includes(serial);
    setDeviceCheckDialog({ open: true, index, exists });
  };

  const handleDeviceRegister = () => {
    const newDevices = [...devices];
    newDevices[deviceCheckDialog.index].verified = true;
    setDevices(newDevices);
    setDeviceCheckDialog({ open: false, index: -1, exists: false });
  };

  const handleFarmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devices.every(d => d.verified)) {
      setErrorDialog({ open: true, message: "모든 디바이스를 조회하고 등록해주세요." });
      return;
    }
    onAddFarm({ name: farmData.name, address: `${farmData.address} ${farmData.detailAddress}`, description: farmData.description });
    navigate("/farms");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#A8D74C]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#072050]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-2xl relative z-10 shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <Button type="button" variant="ghost" onClick={() => navigate("/farms")} className="text-[#6B7280] hover:text-[#A8D74C] hover:bg-[#A8D74C]/5 absolute top-4 left-4 p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button type="button" variant="ghost" onClick={onLogout} className="text-[#6B7280] hover:text-[#DC6C4B] hover:bg-[#DC6C4B]/5 absolute top-4 right-4 p-2 h-auto text-xs">
            <LogOut className="w-4 h-4 mr-1" />
            로그아웃
          </Button>
          <div className="flex flex-col items-center space-y-3 pt-6">
            <ImageWithFallback src={logo} alt="PlantOMars Logo" className="w-16 h-16 object-contain" />
            <div className="text-center space-y-1">
              <h2><span className="text-[#072050]">PLANT</span><span className="text-[#A8D74C]">O</span><span className="text-[#072050]">MANAGER</span></h2>
              <p className="text-[#6B7280] text-sm">농장을 등록하고 관리를 시작하세요</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleFarmSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="farm-name" className="text-[#072050]">농장 이름</Label>
              <Input id="farm-name" placeholder="SEOUL FARM" className="bg-white border-[#072050]/10 focus-visible:ring-[#A8D74C] h-12" value={farmData.name} onChange={(e) => setFarmData({ ...farmData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-address" className="text-[#072050]">주소</Label>
              <div className="flex gap-2">
                <Input id="farm-address" placeholder="주소 검색 버튼을 눌러주세요" className="bg-white border-[#072050]/10 focus-visible:ring-[#A8D74C] h-12 flex-1" value={farmData.address} readOnly required />
                <Button type="button" onClick={openAddressDialog} className="bg-[#A8D74C] hover:bg-[#95C43A] text-white h-12 px-6"><Search className="w-4 h-4 mr-2" />주소 검색</Button>
              </div>
            </div>
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
              <DialogContent className="max-w-2xl w-full p-0 gap-0 h-auto max-h-[90vh]">
                <DialogHeader className="px-6 pt-4 pb-3 border-b border-[#072050]/10 shrink-0"><DialogTitle className="text-[#072050]">주소 검색</DialogTitle><DialogDescription className="text-[#6B7280] text-sm">농장 주소를 검색하고 선택해주세요</DialogDescription></DialogHeader>
                <div id="daum-postcode-container" className="w-full h-[500px]"></div>
              </DialogContent>
            </Dialog>
            <div className="space-y-2">
              <Label htmlFor="farm-detail-address" className="text-[#072050]">상세 주소</Label>
              <Input id="farm-detail-address" placeholder="동/호수 등 상세 주소를 입력하세요" className="bg-white border-[#072050]/10 focus-visible:ring-[#A8D74C] h-12" value={farmData.detailAddress} onChange={(e) => setFarmData({ ...farmData, detailAddress: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="farm-description" className="text-[#072050]">설명</Label>
              <Textarea id="farm-description" placeholder="수직농법을 활용한 친환경 위치한 엽채류 농장" className="bg-white border-[#072050]/10 focus-visible:ring-[#A8D74C] min-h-[80px] resize-none" value={farmData.description} onChange={(e) => setFarmData({ ...farmData, description: e.target.value })} required />
            </div>
            <div className="space-y-3">
              <Label className="text-[#072050]">DEVICE</Label>
              <div className="space-y-4">
                {devices.map((device, index) => (
                  <div key={index} className="space-y-3 p-4 border border-[#072050]/10 rounded-lg bg-[#F5F5F5]/50">
                    <div className="space-y-2">
                      <Label htmlFor={`device-serial-${index}`} className="text-[#072050] text-sm">디바이스 시리얼</Label>
                      <div className="flex gap-2">
                        <Input id={`device-serial-${index}`} placeholder={`SN-${1200331 + index}`} className="bg-white border-[#072050]/10 focus-visible:ring-[#A8D74C] h-12 flex-1" value={device.serial} onChange={(e) => handleDeviceChange(index, 'serial', e.target.value)} required readOnly={device.verified} disabled={device.verified} />
                        <Button type="button" onClick={() => handleDeviceCheck(index)} className="bg-[#DC6C4B] hover:bg-[#C8563B] text-white h-12 px-6">조회</Button>
                        {devices.length > 1 && <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveDevice(index)} className="border-[#DC6C4B]/30 text-[#DC6C4B] hover:bg-[#DC6C4B]/10 h-12 w-12"><X className="w-4 h-4" /></Button>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`device-description-${index}`} className="text-[#072050] text-sm">디바이스 상세 설명</Label>
                      <Input id={`device-description-${index}`} placeholder="디바이스 용도, 위치 등을 입력하세요" className="bg-white border-[#072050]/10 focus-visible:ring-[#A8D74C] h-12" value={device.description} onChange={(e) => handleDeviceChange(index, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" onClick={handleAddDevice} className="w-full bg-[#DC6C4B] hover:bg-[#C8563B] text-white h-12"><Plus className="w-5 h-5 mr-2" />디바이스 추가하기</Button>
            </div>
            <Button type="submit" className="w-full bg-[#A8D74C] hover:bg-[#95C43A] text-white h-12 mt-4">농장 추가하기</Button>
          </form>

          <AlertDialog open={deviceCheckDialog.open} onOpenChange={(open) => !open && setDeviceCheckDialog({ ...deviceCheckDialog, open: false })}>
            <AlertDialogContent className="bg-white border-0 shadow-xl">
              <AlertDialogHeader><AlertDialogTitle className="text-[#072050]">{deviceCheckDialog.exists ? "디바이스 확인" : "디바이스 없음"}</AlertDialogTitle><AlertDialogDescription className="text-[#6B7280]">{deviceCheckDialog.exists ? "해당 DEVICE가 존재합니다. 등록하시겠습니까?" : "해당 DEVICE가 존재하지 않습니다. 시리얼 번호를 확인해주세요."}</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                {deviceCheckDialog.exists ? (<><AlertDialogCancel onClick={() => setDeviceCheckDialog({ ...deviceCheckDialog, open: false })} className="border-[#072050]/20 text-[#072050] hover:bg-[#F5F5F5] hover:text-[#072050]">취소</AlertDialogCancel><AlertDialogAction onClick={handleDeviceRegister} className="bg-[#A8D74C] hover:bg-[#95C43A] text-white border-0">등록</AlertDialogAction></>) : (<AlertDialogAction onClick={() => setDeviceCheckDialog({ ...deviceCheckDialog, open: false })} className="bg-[#DC6C4B] hover:bg-[#C8563B] text-white border-0">확인</AlertDialogAction>)}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={errorDialog.open} onOpenChange={(open) => !open && setErrorDialog({ open: false, message: "" })}>
            <AlertDialogContent className="bg-white border-0 shadow-xl">
              <AlertDialogHeader><AlertDialogTitle className="text-[#072050]">알림</AlertDialogTitle><AlertDialogDescription className="text-[#6B7280]">{errorDialog.message}</AlertDialogDescription></AlertDialogHeader>
              <AlertDialogFooter><AlertDialogAction onClick={() => setErrorDialog({ open: false, message: "" })} className="bg-[#A8D74C] hover:bg-[#95C43A] text-white border-0">확인</AlertDialogAction></AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}