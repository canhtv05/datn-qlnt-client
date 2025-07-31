import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { RoomStatus, RoomType } from "@/enums";
import { ServiceRoomFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface ServiceRoomFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
  buildingOptions: FieldsSelectLabelType[] | undefined;
  floorOptions: FieldsSelectLabelType[] | undefined;
}

const ServiceRoomFilter = ({ props }: { props: ServiceRoomFilterProps }) => {
  const { query, status, roomType } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      {/* <div className="grid grid-cols-2 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Chọn tòa nhà --"
          labelSelect="Chọn tòa nhà"
          data={props.buildingOptions ?? []}
          value={building || id || ""}
          onChange={(value) => handleChange("building", String(value))}
          name="building"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Chọn tầng --"
          labelSelect="Chọn tầng"
          data={props.floorOptions ?? []}
          value={floor ?? ""}
          onChange={(value) => handleChange("floor", String(value))}
          name="floor"
          showClear
        />
      </div> */}
      <div className="grid grid-cols-3 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Loại phòng --"
          labelSelect="Loại phòng"
          data={[
            { label: "Cao cấp", value: RoomType.CAO_CAP },
            { label: "Đơn", value: RoomType.DON },
            { label: "Ghép", value: RoomType.GHEP },
            { label: "Khác", value: RoomType.KHAC },
          ]}
          value={roomType}
          onChange={(value) => handleChange("roomType", String(value))}
          name="roomType"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Còn trống", value: RoomStatus.TRONG },
            { label: "Đã thuê", value: RoomStatus.DANG_THUE },
            { label: "Đặt cọc", value: RoomStatus.DA_DAT_COC },
            { label: "Bảo trì", value: RoomStatus.DANG_BAO_TRI },
            { label: "Chưa hoàn thiện", value: RoomStatus.CHUA_HOAN_THIEN },
            { label: "Tạm khóa", value: RoomStatus.TAM_KHOA },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
          showClear
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default ServiceRoomFilter;
