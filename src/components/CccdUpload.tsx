/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, Dispatch } from "react";
import Dropzone from "react-dropzone";
import { XCircleIcon, ImageIcon } from "lucide-react";
import { cn, parseDate } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import axios from "axios";
import OCRAlertBox from "./OCRAlertBox";
import { ICreateAndUpdateTenant } from "@/types";
import { Gender, Status } from "@/enums";
import { toast } from "sonner";
import RenderIf from "./RenderIf";
import { COLOR_CLASS } from "@/constant";

interface CccdUploadProps {
  frontImage: File | string | null;
  backImage: File | string | null;
  setFrontImage: (file: File | null) => void;
  setBackImage: (file: File | null) => void;
  setValue: Dispatch<React.SetStateAction<ICreateAndUpdateTenant>>;
  errors: Partial<Record<keyof ICreateAndUpdateTenant, string>>;
}

const NA = "N/A";
const API_KEY = import.meta.env.VITE_API_KEY_FPT_AI;
const API_URL = "https://api.fpt.ai/vision/idr/vnm";

const ImagePreview = ({ url, onRemove, loading }: { url: string; onRemove: () => void; loading?: boolean }) => (
  <div className="relative w-full aspect-video rounded-md border border-border overflow-hidden flex items-center justify-center">
    <button type="button" className="absolute top-2 right-2 cursor-pointer z-10" onClick={onRemove}>
      <XCircleIcon className="h-5 w-5 fill-primary text-white" />
    </button>
    <img src={url} alt="CCCD" className="max-w-full max-h-full object-contain" />
    {loading && (
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
        <span className="text-white font-medium animate-pulse">Đang xử lý OCR...</span>
      </div>
    )}
  </div>
);

const OCR_ERROR_MAP: Record<number, string> = {
  0: "No error -- Không có lỗi",
  1: "Sai thông số trong request",
  2: "CMT bị thiếu góc, không thể crop chuẩn",
  3: "Không tìm thấy CMT trong ảnh hoặc ảnh mờ",
  5: "URL bỏ trống",
  6: "Không mở được URL",
  7: "File không phải ảnh",
  8: "File hỏng hoặc format không hỗ trợ",
  9: "String base64 bỏ trống",
  10: "String base64 không hợp lệ",
};

export default function CccdUpload({
  frontImage,
  backImage,
  setFrontImage,
  setBackImage,
  setValue,
  errors,
}: CccdUploadProps) {
  const [frontUrl, setFrontUrl] = useState<string | null>(null);
  const [backUrl, setBackUrl] = useState<string | null>(null);
  const [frontResult, setFrontResult] = useState<any>(null);
  const [backResult, setBackResult] = useState<any>(null);
  const [touchedFront, setTouchedFront] = useState(false);
  const [touchedBack, setTouchedBack] = useState(false);
  const [loadingFront, setLoadingFront] = useState(false);
  const [loadingBack, setLoadingBack] = useState(false);

  const callOcrApi = async (file: File, side: "front" | "back") => {
    try {
      if (side === "front") setLoadingFront(true);
      if (side === "back") setLoadingBack(true);

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(API_URL, formData, {
        headers: { "api-key": API_KEY, "Content-Type": "multipart/form-data" },
      });

      if (side === "front") setFrontResult(res.data.data);
      if (side === "back") setBackResult(res.data.data);
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(OCR_ERROR_MAP[err?.response?.data?.errorCode] || Status.ERROR);
      else toast.error(Status.ERROR);
    } finally {
      if (side === "front") setLoadingFront(false);
      if (side === "back") setLoadingBack(false);
    }
  };

  useEffect(() => {
    if (frontImage instanceof File) {
      const url = URL.createObjectURL(frontImage);
      setFrontUrl(url);
      callOcrApi(frontImage, "front");
      return () => URL.revokeObjectURL(url);
    } else if (typeof frontImage === "string") setFrontUrl(frontImage);
    else {
      setFrontUrl(null);
      setFrontResult(null);
    }
  }, [frontImage]);

  useEffect(() => {
    if (backImage instanceof File) {
      const url = URL.createObjectURL(backImage);
      setBackUrl(url);
      callOcrApi(backImage, "back");
      return () => URL.revokeObjectURL(url);
    } else if (typeof backImage === "string") setBackUrl(backImage);
    else {
      setBackUrl(null);
      setBackResult(null);
    }
  }, [backImage]);

  // console.log(frontResult, backResult);

  useEffect(() => {
    if (Array.isArray(frontResult) && frontResult.length > 0) {
      const res = frontResult[0];
      setValue((prev) => ({
        ...prev,
        fullName: res?.name !== NA ? res?.name : "",
        gender: res?.sex === "NAM" && res?.sex !== NA ? Gender.MALE : Gender.FEMALE,
        dob: res?.dob && res?.dob !== NA ? new Date(parseDate(res?.dob)).toISOString() : "",
        identityCardNumber: res?.id && res?.id !== NA ? res?.id : "",
        address: res?.address && res?.address !== NA ? res?.address : "",
        frontCccd: frontImage instanceof File ? frontImage : prev.frontCccd,
      }));
    }
  }, [frontResult, frontImage, setValue]);

  useEffect(() => {
    if (Array.isArray(backResult) && backResult.length > 0) {
      setValue((prev) => ({
        ...prev,
        backCccd: backImage instanceof File ? backImage : prev.backCccd,
      }));
    }
  }, [backResult, backImage, setValue]);

  useEffect(() => {
    if (frontResult?.length > 0 && backResult?.length > 0 && frontResult[0]?.id && backResult[0]?.mrz_details?.id) {
      const frontId = frontResult[0]?.id;
      const backId = backResult[0]?.mrz_details?.id;

      if (frontId !== backId) {
        setFrontImage(null);
        setBackImage(null);

        setValue((prev) => ({
          ...prev,
          frontCccd: null,
          backCccd: null,
          identityCardNumber: "",
          fullName: "",
          address: "",
          dob: "",
          gender: "",
        }));

        toast.error("Mặt trước và mặt sau CCCD không khớp!");
        setFrontResult(null);
        setBackResult(null);
      }
    }
  }, [frontResult, backResult, setValue, setFrontImage, setBackImage]);

  const isFrontInvalid = touchedFront && !frontImage;
  const isBackInvalid = touchedBack && !backImage;

  const renderDropzone = (
    loading: boolean,
    setImage: (file: File | null) => void,
    setTouched: (val: boolean) => void
  ) => (
    <Dropzone
      onDrop={(files) => {
        setTouched(true);
        if (files[0]) setImage(files[0]);
      }}
      accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
      maxFiles={1}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={cn(
            COLOR_CLASS.gray,
            "flex items-center justify-center w-full aspect-video rounded-md cursor-pointer relative"
          )}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-10 w-10" strokeWidth={1.25} />
          {loading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
              <span className="text-white font-medium animate-pulse">Đang xử lý OCR...</span>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );

  return (
    <div className="flex flex-col gap-3">
      <Label>
        Ảnh CCCD <span className="text-[10px] text-red-500">(*)</span>
      </Label>
      <div className="flex gap-5 md:flex-row flex-col w-full">
        {/** Mặt trước */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <span className="text-sm text-center">
            Mặt trước <span className="text-[10px] text-red-500">(*)</span>
            <span className="block">🤖 AI sẽ tự động kiểm tra</span>
          </span>
          {frontUrl ? (
            <ImagePreview url={frontUrl} onRemove={() => setFrontImage(null)} loading={loadingFront} />
          ) : (
            renderDropzone(loadingFront, setFrontImage, setTouchedFront)
          )}
          {frontResult && !loadingFront && (
            <OCRAlertBox
              overallScore={Number(frontResult[0]?.overall_score)}
              type={frontResult[0]?.type || frontResult[0]?.type_new}
              fields={frontResult[0]}
              side="front"
            />
          )}
          <RenderIf value={isFrontInvalid}>
            <span className="text-[12px] text-red-500 font-light text-left">Thông tin bắt buộc</span>
          </RenderIf>
          <span className="text-[12px] text-red-500 font-light text-left">{errors.frontCccd}</span>
        </div>

        {/** Mặt sau */}
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <span className="text-sm text-center">
            Mặt sau <span className="text-[10px] text-red-500">(*)</span>
            <span className="block">🤖 AI sẽ tự động kiểm tra</span>
          </span>
          {backUrl ? (
            <ImagePreview url={backUrl} onRemove={() => setBackImage(null)} loading={loadingBack} />
          ) : (
            renderDropzone(loadingBack, setBackImage, setTouchedBack)
          )}
          {backResult && !loadingBack && (
            <OCRAlertBox
              overallScore={Number(backResult[0]?.overall_score)}
              type={backResult[0]?.type || backResult[0]?.type_new}
              fields={backResult[0]}
              side="back"
            />
          )}
          <RenderIf value={isBackInvalid}>
            <span className="text-[12px] text-red-500 font-light text-left">Thông tin bắt buộc</span>
          </RenderIf>
          <span className="text-[12px] text-red-500 font-light text-left">{errors.backCccd}</span>
        </div>
      </div>
    </div>
  );
}
