import { FeedbackStatus, FeedbackType } from "@/enums";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import ButtonFilter from "@/components/ButtonFilter";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { FeedbackFilterValues } from "@/types";

interface Props {
  props: {
    filterValues: FeedbackFilterValues;
    setFilterValues: Dispatch<SetStateAction<FeedbackFilterValues>>;
    onClear: () => void;
    onFilter: () => void;
  };
}

const feedbackTypeOptions = [
  { label: "Góp ý", value: FeedbackType.GOP_Y },
  { label: "Khiếu nại", value: FeedbackType.KHIEU_NAI },
  { label: "Khác", value: FeedbackType.KHAC },
];

const feedbackStatusOptions = [
  { label: "Chưa xử lý", value: FeedbackStatus.CHUA_XU_LY },
  { label: "Đang xử lý", value: FeedbackStatus.DANG_XU_LY },
  { label: "Đã xử lý", value: FeedbackStatus.DA_XU_LY },
  { label: "Hủy", value: FeedbackStatus.HUY },
];

const ratingOptions = [1, 2, 3, 4, 5].map((r) => ({
  label: `${r} sao`,
  value: r,
}));

const FeedbackTenantFilter = ({ props }: Props) => {
  const { filterValues, setFilterValues, onClear, onFilter } = props;

  const handleChange = (
    key: keyof FeedbackFilterValues,
    value: string | number | undefined
  ) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form
      className="bg-background p-5 flex flex-col gap-2 items-end"
      onSubmit={handleSubmit}
    >
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Loại phản hồi --"
          labelSelect="Loại phản hồi"
          data={feedbackTypeOptions}
          value={filterValues.feedbackType ?? ""}
          onChange={(val) => handleChange("feedbackType", val as string)}
          name="feedbackType"
          showClear
        />

        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={feedbackStatusOptions}
          value={filterValues.feedbackStatus ?? ""}
          onChange={(val) => handleChange("feedbackStatus", val as string)}
          name="feedbackStatus"
          showClear
        />

        <InputLabel
          placeholder="Tìm kiếm nội dung"
          id="query"
          name="query"
          value={filterValues.query ?? ""}
          onChange={(e) => handleChange("query", e.target.value)}
        />

        <FieldsSelectLabel
          placeholder="-- Đánh giá --"
          labelSelect="Đánh giá"
          data={ratingOptions}
          value={filterValues.rating ?? ""}
          onChange={(val) => handleChange("rating", Number(val))}
          name="rating"
          showClear
        />
      </div>

      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default FeedbackTenantFilter;
