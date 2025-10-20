import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import logo from "@/assets/ad8065eaf38fb6ecbe2925eea91682c28d625da3.png";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      email: loginData.email,
      password: loginData.password,
    };

    try {
      const response = await axios.post(
        "/api/auth/login", // The full URL will be handled by the proxy
        dataToSend,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200 && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        toast.success("로그인 성공!");
        onLoginSuccess();
        navigate("/farms");
      }
    } catch (error) {
      toast.error("이메일 또는 비밀번호가 일치하지 않습니다.");
      console.error("로그인 실패:", error);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- 유효성 검사 로직 추가 ---
    if (signupData.name.trim().length < 2) {
      toast.error("이름은 2자 이상 입력해주세요.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      toast.error("올바른 이메일 형식이 아닙니다.");
      return;
    }

    if (signupData.password.length < 8) {
      toast.error("비밀번호는 8자 이상 입력해주세요.");
      return;
    }
    // --- 유효성 검사 로직 끝 ---

    if (signupData.password !== signupData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (response.ok) {
        toast.success("회원가입이 성공적으로 완료되었습니다. 로그인 해주세요.");
        setActiveTab("login"); // 회원가입 성공 후 로그인 탭으로 전환
      } else {
        const errorText = await response.text();
        console.log("HTTP Status Code:", response.status);
        console.log("Error Response Text:", errorText);
        toast.error(errorText || "회원가입에 실패했습니다.");
      }
    } catch (error) {



      console.error("회원가입 요청 중 오류 발생:", error);
      toast.error("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F5F5]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#90CD5B]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#072050]/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-xl border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex flex-col items-center space-y-3">
            <ImageWithFallback src={logo} alt="PlantOMars Logo" className="w-16 h-16 object-contain" />
            <div className="text-center space-y-1">
              <h2>
                <span className="text-[#072050]">PLANT</span><span className="text-[#A8D74C]">O</span><span className="text-[#072050]">MANAGER</span>
              </h2>
              <p className="text-[#6B7280] text-sm">당신을 위한 농장 관리 시스템</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#EDEDED]">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-[#072050]">로그인</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-[#072050]">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-[#072050]">이메일</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input id="login-email" type="text" placeholder="ADMIN" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-[#072050]">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input id="login-password" type="password" placeholder="••••••••" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" checked={loginData.remember} onCheckedChange={(checked) => setLoginData({ ...loginData, remember: checked as boolean })} className="border-[#A8D74C]/40 data-[state=checked]:bg-[#A8D74C] data-[state=checked]:border-[#A8D74C]" />
                    <label htmlFor="remember" className="text-sm text-[#6B7280] cursor-pointer">로그인 상태 유지</label>
                  </div>
                  <button type="button" className="text-sm text-[#072050] hover:text-[#90CD5B] transition-colors" onClick={() => navigate("/forgot-password")}>비밀번호 찾기</button>
                </div>
                <Button type="submit" className="w-full bg-[#A8D74C] hover:bg-[#90C038] text-white transition-colors h-12">로그인</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-[#072050]">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input id="signup-name" type="text" placeholder="홍길동" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-[#072050]">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input id="signup-email" type="email" placeholder="your@email.com" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-[#072050]">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input id="signup-password" type="password" placeholder="8자 이상 입력하세요" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required minLength={8} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-[#072050]">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                    <Input id="signup-confirm-password" type="password" placeholder="비밀번호를 다시 입력하세요" className="pl-10 bg-white border-[#072050]/10 focus-visible:ring-[#90CD5B] h-12" value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} required />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full bg-[#A8D74C] hover:bg-[#90C038] text-white transition-colors h-12" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    회원가입
                  </Button>
                </div>
                <p className="text-xs text-center text-[#6B7280]">
                  회원가입 시{" "}
                  <button type="button" className="text-[#072050] hover:underline">이용약관</button>
                  {" "}및{" "}
                  <button type="button" className="text-[#072050] hover:underline">개인정보처리방침</button>
                  에 동의하게 됩니다.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#072050]/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-[#6B7280]">또는</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full border-[#072050]/10 hover:bg-[#F5F5F5] text-[#072050] h-12" onClick={() => console.log("Google 로그인")}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google로 계속하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}