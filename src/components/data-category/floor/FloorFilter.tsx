import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { FloorStatus, FloorType } from "@/enums";
import { ApiResponse, FloorFilterValues, IBuildingCardsResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";
import { toast } from "sonner";

export interface BuildingFilterProps {
  filterValues: FloorFilterValues;
  setFilterValues: Dispatch<SetStateAction<FloorFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const FloorFilter = ({ props }: { props: BuildingFilterProps }) => {
  const { status, buildingId, maxRoom, nameFloor, floorType } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof FloorFilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  const { data, isError } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
    queryKey: ["buildings-cards"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/cards");
      return res.data;
    },
  });

  if (isError) toast.error("Không lấy được dữ liệu tòa nhà");

  const mapValueAndLabel = useMemo(() => {
    const buildings: IBuildingCardsResponse[] = data?.data ?? [];
    return buildings.map((building) => ({
      label: building.buildingName,
      value: building.buildingId,
    }));
  }, [data]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Trạng thái hoạt động --"
          labelSelect="Trạng thái"
          data={[
            { label: "Hoạt động", value: FloorStatus.HOAT_DONG },
            { label: "Tạm khóa", value: FloorStatus.TAM_KHOA },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Loại tầng --"
          labelSelect="Loại tầng"
          data={[
            { label: "Cho thuê", value: FloorType.CHO_THUE },
            { label: "Để ở", value: FloorType.DE_O },
            { label: "Kho", value: FloorType.KHO },
            { label: "Không cho thuê", value: FloorType.KHONG_CHO_THUE },
            { label: "Khác", value: FloorType.KHAC },
          ]}
          value={floorType}
          onChange={(value) => handleChange("floorType", String(value))}
          name="floorType"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={mapValueAndLabel}
          value={buildingId}
          onChange={(value) => handleChange("buildingId", String(value))}
          name="buildingId"
          showClear
        />
        <InputLabel
          type="text"
          id="nameFloor"
          name="nameFloor"
          placeholder="Tên tòa nhà"
          value={nameFloor}
          onChange={(e) => handleChange("nameFloor", e.target.value)}
        />
        <InputLabel
          type="number"
          id="maxRoom"
          name="maxRoom"
          placeholder="Số phòng tối đa"
          value={maxRoom}
          onChange={(e) => handleChange("maxRoom", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default FloorFilter;
