import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { ApiResponse, IBuildingCardsResponse, FloorBasicResponse, FilterRoomValues } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";
import { toast } from "sonner";

export interface RoomFilterProps {
  filterValues: FilterRoomValues;
  setFilterValues: Dispatch<SetStateAction<FilterRoomValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const RoomFilter = ({ props }: { props: RoomFilterProps }) => {
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { status, maxPrice, minPrice, maxAcreage, minAcreage, maximumPeople, buildingId, floorId } = filterValues;

  const handleChange = (key: keyof FilterRoomValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  const { data: buildingData, isError: isBuildingError } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
    queryKey: ["buildings-cards"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/cards");
      return res.data;
    },
  });

  const { data: floorData, isError: isFloorError } = useQuery<ApiResponse<FloorBasicResponse[]>>({
    queryKey: ["floor-list", buildingId],
    queryFn: async () => {
      const res = await httpRequest.get("/floors/find-all", {
        params: { buildingId },
      });
      return res.data;
    },
    enabled: !!buildingId,
  });

  if (isBuildingError) toast.error("Không lấy được danh sách tòa nhà");
  if (isFloorError) toast.error("Không lấy được danh sách tầng");

  const buildingOptions = useMemo(() => {
    return (buildingData?.data ?? []).map((b) => ({
      label: b.buildingName,
      value: b.id,
    }));
  }, [buildingData]);

  const floorOptions = useMemo(() => {
    return (floorData?.data ?? []).map((f) => ({
      label: f.nameFloor,
      value: f.id,
    }));
  }, [floorData]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        {/* 1. Tòa nhà */}
        <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={buildingOptions}
          value={buildingId}
          onChange={(value) => handleChange("buildingId", String(value))}
          name="buildingId"
          showClear
        />

        {/* 2. Tầng */}
        <FieldsSelectLabel
          placeholder="-- Tầng --"
          labelSelect="Tầng"
          data={floorOptions}
          value={floorId}
          onChange={(value) => handleChange("floorId", String(value))}
          name="floorId"
          showClear
        />

        {/* 3. Trạng thái */}
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Trống", value: "TRONG" },
            { label: "Đang thuê", value: "DANG_THUE" },
            { label: "Đã đặt cọc", value: "DA_DAT_COC" },
            { label: "Đang bảo trì", value: "DANG_BAO_TRI" },
            { label: "Chưa hoàn thiện", value: "CHUA_HOAN_THIEN" },
            { label: "Tạm khóa", value: "TAM_KHOA" },
            { label: "Hủy hoạt động", value: "HUY_HOAT_DONG" },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
          showClear
        />

        {/* 4. Số người tối đa */}
        <InputLabel
          type="number"
          id="maximumPeople"
          name="maximumPeople"
          placeholder="Số người tối đa"
          value={maximumPeople}
          onChange={(e) => handleChange("maximumPeople", e.target.value)}
        />

        {/* 5. Khoảng giá */}
        <div className="flex gap-2">
          <InputLabel
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
          <InputLabel
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder="Giá đến"
            value={maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>

        {/* 6. Khoảng diện tích */}
        <div className="flex gap-2">
          <InputLabel
            type="number"
            id="minAcreage"
            name="minAcreage"
            placeholder="DT từ"
            value={minAcreage}
            onChange={(e) => handleChange("minAcreage", e.target.value)}
          />
          <InputLabel
            type="number"
            id="maxAcreage"
            name="maxAcreage"
            placeholder="DT đến"
            value={maxAcreage}
            onChange={(e) => handleChange("maxAcreage", e.target.value)}
          />
        </div>
      </div>

      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default RoomFilter;
