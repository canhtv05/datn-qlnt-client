import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { BuildingStatus, BuildingType } from "@/enums";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface FilterValues {
  query: string;
  status: string;
  buildingType: string;
}

export interface BuildingFilterProps {
  filterValues: FilterValues;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const switchGrid = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end";
  }
};

const BuildingFilter = ({ props, type }: { props: BuildingFilterProps; type: "default" | "restore" }) => {
  const { query, status, buildingType } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid(type)}>
        <RenderIf value={type === "default"}>
          <FieldsSelectLabel
            placeholder="-- Trạng thái hoạt động --"
            labelSelect="Trạng thái"
            data={[
              { label: "Hoạt động", value: BuildingStatus.HOAT_DONG },
              { label: "Tạm khóa", value: BuildingStatus.TAM_KHOA },
            ]}
            value={status}
            onChange={(value) => handleChange("status", String(value))}
            name="status"
          />
        </RenderIf>
        <FieldsSelectLabel
          placeholder="-- Loại nhà --"
          labelSelect="Loại nhà"
          data={[
            { label: "Căn hộ dịch vụ", value: BuildingType.CAN_HO_DICH_VU },
            { label: "Chung cư mini", value: BuildingType.CHUNG_CU_MINI },
            { label: "Nhà trọ", value: BuildingType.NHA_TRO },
            { label: "Khác", value: BuildingType.KHAC },
          ]}
          value={buildingType}
          onChange={(value) => handleChange("buildingType", String(value))}
          name="buildingType"
        />
        <InputLabel
          type="text"
          id="search"
          name="search"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default BuildingFilter;
