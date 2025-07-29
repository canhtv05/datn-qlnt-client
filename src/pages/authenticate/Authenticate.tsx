import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, CircleAlert, Loader } from "lucide-react";

import { httpRequest } from "@/utils/httpRequest";
import RenderIf from "@/components/RenderIf";
import { useAuthStore } from "@/zustand/authStore";
import { Status } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { ApiResponse, UserResponse } from "@/types";
import { RoleType } from "@/hooks/useHighestRole";
import { getHighestRole } from "@/lib/utils";

const Authenticate = () => {
  const navigate = useNavigate();
  const authCode = new URLSearchParams(window.location.search).get("code");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const clearUser = useAuthStore((state) => state.clearUser);
  const setUser = useAuthStore((state) => state.setUser);

  const { data, error } = useQuery({
    queryKey: ["authenticate", authCode],
    queryFn: () =>
      httpRequest.post<ApiResponse<UserResponse>>(`/auth/login/oauth2/google/authentication?code=${authCode}`),
    enabled: !!authCode,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!authCode) {
      toast.error(Status.ERROR);
      navigate("/login");
    }
  }, [authCode, navigate]);

  useEffect(() => {
    if (data) {
      setShowSuccessScreen(true);
      const timer = setTimeout(() => {
        setUser(data.data.data, true);
        const roles: RoleType[] = data.data.data.roles.map((r) => r.name as RoleType);

        const highestRole = getHighestRole(roles);

        if (highestRole === "USER") {
          navigate("/room");
        } else {
          navigate("/dashboard");
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else if (error) {
      clearUser();
      navigate("/login");
      handleMutationError(error);
    }
  }, [clearUser, data, error, navigate, setUser]);

  let authStatus: "authenticating" | "success" | "error" = "authenticating";
  if (error) authStatus = "error";
  else if (data) authStatus = "success";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col items-center space-y-6">
          <RenderIf value={authStatus === "authenticating"}>
            <div className="animate-spin text-primary">
              <Loader className="w-10 h-10" aria-label="Loading" />
            </div>
          </RenderIf>

          <RenderIf value={authStatus === "error"}>
            <div className="text-red-500">
              <CircleAlert className="w-10 h-10" aria-label="Error" />
            </div>
          </RenderIf>

          <RenderIf value={authStatus === "success" && showSuccessScreen}>
            <div className="text-primary">
              <Check className="w-10 h-10" aria-label="Success" />
            </div>
          </RenderIf>

          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              <RenderIf value={authStatus === "authenticating"}>Đang xác thực</RenderIf>
              <RenderIf value={authStatus === "error"}>Lỗi</RenderIf>
              <RenderIf value={authStatus === "success" && showSuccessScreen}>Xác thực thành công!</RenderIf>
            </h2>
            <p className="text-sm text-gray-600">
              {authStatus === "error"
                ? "Vui lòng thử lại hoặc liên hệ với hỗ trợ nếu vấn đề vẫn còn."
                : authStatus === "success" && showSuccessScreen
                  ? "Chuyển hướng trong giây lát..."
                  : "Vui lòng đợi trong khi chúng tôi thiết lập tài khoản của bạn."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
