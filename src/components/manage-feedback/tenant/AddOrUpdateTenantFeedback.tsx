import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import TextareaLabel from "@/components/TextareaLabel";
import StarRating from "@/components/StarRating";
import InputLabel from "@/components/InputLabel";
import { FeedbackFormValue, Option } from "@/types";
import { Dispatch, ChangeEvent } from "react";
import { FeedbackType } from "@/enums";

interface Props {
  value: FeedbackFormValue;
  setValue: Dispatch<React.SetStateAction<FeedbackFormValue>>;
  errors: Partial<Record<keyof FeedbackFormValue, string>>;
  tenantOptions: Option[];
  roomOptions: Option[];
}

const feedbackTypes: FieldsSelectLabelType[] = [
  { label: "Góp ý", value: FeedbackType.GOP_Y },
  { label: "Khiếu nại", value: FeedbackType.KHIEU_NAI },
  { label: "Khác", value: FeedbackType.KHAC },
];

const AddOrUpdateTenantFeedback = ({
  value,
  setValue,
  errors,
  tenantOptions,
  roomOptions,
}: Props) => {
  const handleChange = <K extends keyof FeedbackFormValue>(
    key: K,
    newValue: FeedbackFormValue[K]
  ) => {
    setValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange("attachment", file.name);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Chọn khách thuê */}
      <FieldsSelectLabel
        data={tenantOptions}
        placeholder="-- Chọn khách thuê --"
        labelSelect="Khách thuê"
        id="tenantId"
        name="tenantId"
        value={value.tenantId ?? ""}
        onChange={(val) => handleChange("tenantId", val as string)}
        showClear
        errorText={errors.tenantId}
      />

      {/* Chọn phòng */}
      <FieldsSelectLabel
        data={roomOptions}
        placeholder="-- Chọn phòng --"
        labelSelect="Phòng"
        id="roomId"
        name="roomId"
        value={value.roomId ?? ""}
        onChange={(val) => handleChange("roomId", val as string)}
        showClear
        errorText={errors.roomId}
      />

      {/* Loại phản hồi */}
      <FieldsSelectLabel
        data={feedbackTypes}
        placeholder="-- Chọn loại phản hồi --"
        labelSelect="Loại phản hồi"
        id="feedbackType"
        name="feedbackType"
        value={value.feedbackType ?? ""}
        onChange={(val) => handleChange("feedbackType", val as FeedbackType)}
        showClear
        errorText={errors.feedbackType}
      />

      {/* Đánh giá sao */}
      <StarRating
        rating={value.rating}
        onChange={(val) => handleChange("rating", val)}
      />

      {/* Nội dung phản hồi */}
      <TextareaLabel
        id="content"
        name="content"
        placeholder="Nhập nội dung phản hồi"
        label="Nội dung"
        value={value.content ?? ""}
        onChange={(e) => handleChange("content", e.target.value)}
        errorText={errors.content}
      />

      {/* File đính kèm */}
      <InputLabel
        id="attachment"
        name="attachment"
        type="file"
        label="Tệp đính kèm (nếu có)"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AddOrUpdateTenantFeedback;
