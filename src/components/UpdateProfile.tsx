import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-yellow-300 bg-yellow-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
        <div className="flex flex-col">
          <p className="text-sm font-medium text-yellow-800">Vui lòng cập nhật đầy đủ thông tin cá nhân</p>
          <p className="text-xs text-yellow-700 mt-1">Một số tính năng sẽ không khả dụng nếu hồ sơ chưa hoàn chỉnh.</p>
        </div>
      </div>

      <Button
        size="sm"
        className="bg-yellow-600 hover:bg-yellow-700 text-white"
        onClick={() => navigate("/profile", { state: { background: location } })}
      >
        Cập nhật ngay
      </Button>
    </div>
  );
};

export default UpdateProfile;
