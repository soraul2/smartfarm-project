import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft } from "lucide-react";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("비밀번호 재설정 이메일:", resetEmail);
    setResetSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#90CD5B]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#072050]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-center space-y-1">
              <h2 className="text-[25px] font-extrabold"><span className="text-[#072050]">PLANT</span><span className="text-[#a85a48]">O</span><span className="text-[#072050]">MANAGER</span></h2>
              <p className="text-[#6B7280] text-sm">비밀번호를 재설정하세요</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!resetSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-[#072050]">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input id="reset-email" type="email" placeholder="your@email.com" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                </div>
                <p className="text-sm text-[#6B7280]">가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
              </div>
              <Button type="submit" className="w-full bg-[#A8D74C] hover:bg-[#90C038] text-white transition-colors h-12">재설정 링크 보내기</Button>
              <Button type="button" variant="ghost" className="w-full text-[#072050] hover:bg-[#072050]/5" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />로그인으로 돌아가기
              </Button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto bg-[#A8D74C]/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#A8D74C]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[#072050]">이메일을 확인하세요</h3>
                <p className="text-sm text-[#6B7280]">{resetEmail}로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.</p>
              </div>
              <Button type="button" variant="outline" className="w-full border-[#072050]/10 hover:bg-[#F5F5F5] text-[#072050]" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />로그인으로 돌아가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}