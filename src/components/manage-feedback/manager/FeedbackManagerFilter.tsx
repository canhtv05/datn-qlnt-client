import { FeedbackStatus, FeedbackType } from "@/enums";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import ButtonFilter from "@/components/ButtonFilter";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";
import {
  ApiResponse,
  FeedbackFilterValues,
  IBuildingCardsResponse,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { toast } from "sonner";

interface Props {
  props: {
    filterValues: FeedbackFilterValues;
    setFilterValues: Dispatch<SetStateAction<FeedbackFilterValues>>;
    onClear: () => void;
    onFilter: () => void;
  };
}

const FeedbackManagerFilter = ({ props }: Props) => {
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

  const { data: buildingData, isError: isBuildingError } = useQuery<
    ApiResponse<IBuildingCardsResponse[]>
  >({
    queryKey: ["buildings-cards"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/cards");
      return res.data;
    },
  });

  if (isBuildingError) toast.error("Không lấy được danh sách tòa nhà");

  const buildingOptions = useMemo(() => {
    return (buildingData?.data ?? []).map((b) => ({
      label: b.buildingName,
      value: b.id,
    }));
  }, [buildingData]);

  return (
    <form
      className="bg-background p-5 flex flex-col gap-2 items-end"
      onSubmit={handleSubmit}
    >
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={buildingOptions}
          value={filterValues.buildingId ?? ""}
          onChange={(val) => handleChange("buildingId", val as string)}
          name="buildingId"
          showClear
        />
        {/* Loại phản hồi */}
        <FieldsSelectLabel
          placeholder="-- Loại phản hồi --"
          labelSelect="Loại phản hồi"
          data={[
            { label: "Góp ý", value: FeedbackType.GOP_Y },
            { label: "Khiếu nại", value: FeedbackType.KHIEU_NAI },
            { label: "Khác", value: FeedbackType.KHAC },
          ]}
          value={filterValues.feedbackType ?? ""}
          onChange={(val) => handleChange("feedbackType", val as string)}
          name="feedbackType"
          showClear
        />
        {/* Trạng thái */}
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Chưa xử lý", value: FeedbackStatus.CHUA_XU_LY },
            { label: "Đang xử lý", value: FeedbackStatus.DANG_XU_LY },
            { label: "Đã xử lý", value: FeedbackStatus.DA_XU_LY },
            { label: "Hủy", value: FeedbackStatus.HUY },
          ]}
          value={filterValues.feedbackStatus ?? ""}
          onChange={(val) => handleChange("feedbackStatus", val as string)}
          name="feedbackStatus"
          showClear
        />
        {/* Đánh giá sao */}
        <FieldsSelectLabel
          placeholder="-- Đánh giá --"
          labelSelect="Đánh giá"
          data={[1, 2, 3, 4, 5].map((rate) => ({
            label: `${rate} sao`,
            value: rate,
          }))}
          value={filterValues.rating ?? ""}
          onChange={(val) =>
            handleChange("rating", val === "" ? undefined : Number(val))
          }
          name="rating"
          showClear
        />
        <InputLabel
          placeholder="Tìm kiếm nội dung"
          id="query"
          name="query"
          value={filterValues.query ?? ""}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default FeedbackManagerFilter;
