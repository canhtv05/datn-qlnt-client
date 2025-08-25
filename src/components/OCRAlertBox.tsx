import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import RenderIf from "./RenderIf";

interface OCRAlertBoxProps {
  overallScore: number;
  type: string; // ví dụ: chip_front, chip_back, cccd_12_front, ...
  fields: Record<string, string | Record<string, string>>;
  side: "front" | "back"; // thêm side để biết đang hiển thị mặt nào
}

export default function OCRAlertBox({ overallScore, type, fields, side }: OCRAlertBoxProps) {
  const REQUIRED_FIELDS: Record<string, string[]> = {
    cmnd_09_front: ["id", "name", "dob", "home", "address"],
    cmnd_12_front: ["id", "name", "dob", "home", "address"],
    cccd_12_front: ["id", "name", "dob", "sex", "nationality", "home", "address", "doe"],
    chip_front: ["id", "name", "dob", "sex", "nationality", "home", "address", "doe"],
    old_back: ["ethnicity", "religion", "features", "issue_date", "issue_loc"],
    new_back: ["features", "issue_date"],
    chip_back: ["features", "issue_date"],
    cc_front: ["id", "name", "dob", "sex", "nationality", "home", "address", "doe"],
  };

  const OPTIONAL_FIELDS: Record<string, string[]> = {
    cmnd_09_front: ["type"],
    cmnd_12_front: ["type", "sex", "nationality", "doe", "address_entities"],
    cccd_12_front: ["type", "sex", "nationality", "doe", "address_entities"],
    chip_front: ["type", "sex", "nationality", "doe", "address_entities"],
    old_back: ["type", "features", "issue_date", "issue_loc", "religion", "ethnicity"],
    new_back: ["type", "features", "issue_date", "issue_loc"],
    chip_back: ["type", "features", "issue_date"],
    cc_front: ["type", "address_entities"],
  };

  const required = REQUIRED_FIELDS[type] || [];
  const optional = OPTIONAL_FIELDS[type] || [];

  const missingRequired = required.filter((f) => !fields[f] || fields[f] === "N/A");

  const isFront = side === "front";
  const isBack = side === "back";
  const typeIsFront = type.includes("front");
  const typeIsBack = type.includes("back");
  const sideMismatch = (isFront && !typeIsFront) || (isBack && !typeIsBack);

  const isValid = missingRequired.length === 0 && !sideMismatch;

  const [isVisible, setIsVisible] = useState<boolean>(true);

  return (
    <RenderIf value={isVisible}>
      <div
        className={`relative w-full rounded-xl border p-4 shadow-sm ${
          isValid ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
        }`}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-black"
          type="button"
          onClick={() => setIsVisible(false)}
        >
          <XCircle className="h-5 w-5" />
        </button>

        <div className={`flex items-center gap-2 font-medium mb-3 ${isValid ? "text-green-700" : "text-red-700"}`}>
          {isValid ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          {isValid ? (
            <>
              Ảnh hợp lệ{" "}
              <span className="text-sm text-gray-500">
                ({required.length}/{required.length} bắt buộc)
              </span>
            </>
          ) : sideMismatch ? (
            <>
              Ảnh không hợp lệ{" "}
              <span className="text-sm text-gray-500">
                (mặt {side === "back" ? "sau" : "trước"} nhưng AI trả về{" "}
                {type.includes("back") ? "mặt sau" : "mặt trước"})
              </span>
            </>
          ) : (
            <>
              Ảnh không hợp lệ{" "}
              <span className="text-sm text-gray-500">(thiếu {missingRequired.length} trường bắt buộc)</span>
            </>
          )}
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-black">Độ tin cậy:</span>
            <span className="text-black">{overallScore}%</span>
          </div>
          <div className="w-full h-2 rounded bg-gray-200 overflow-hidden">
            <div
              className={`h-2 rounded ${isValid ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="text-sm font-medium text-gray-700 mb-1">Trường bắt buộc:</div>
          <div className="flex flex-wrap gap-2">
            {required.map((f, i) => {
              const isFieldValid = fields[f] && fields[f] !== "N/A";
              return (
                <span
                  key={i}
                  className={`rounded-md px-2 py-1 text-xs ${
                    isFieldValid ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {f}
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Trường bổ sung:</div>
          <div className="flex flex-wrap gap-2">
            {optional.map((f, i) => {
              const isFieldPresent = fields[f] && fields[f] !== "N/A";
              return (
                <span
                  key={i}
                  className={`rounded-md px-2 py-1 text-xs ${
                    isFieldPresent ? "bg-orange-200 text-orange-800" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {f}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </RenderIf>
  );
}
