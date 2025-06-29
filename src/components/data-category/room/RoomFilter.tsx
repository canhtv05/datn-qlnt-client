import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface FilterRoomValues {
  query: string;
  status: string;
  rentalStatus: string;
  roomType: string;
  buildingId: string;
  // floor: string; // ẩn tạm thời
}

export interface RoomFilterProps {
  filterValues: FilterRoomValues;
  setFilterValues: Dispatch<SetStateAction<FilterRoomValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const RoomFilter = ({ props }: { props: RoomFilterProps }) => {
  const { query, status, rentalStatus, roomType, buildingId } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof FilterRoomValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={[
            { label: "Tòa A", value: "toa-a" },
            { label: "Tòa B", value: "toa-b" },
          ]}
          value={buildingId}
          onChange={(value) => handleChange("buildingId", String(value))}
          name="buildingId"
        />

        {/* Tạm thời ẩn trường Tầng */}
        {/* 
        <FieldsSelectLabel
          placeholder="-- Tầng --"
          labelSelect="Tầng"
          data={[
            { label: "Tầng 1", value: "1" },
            { label: "Tầng 2", value: "2" },
            { label: "Tầng 3", value: "3" },
          ]}
          value={floor}
          onChange={(value) => handleChange("floor", String(value))}
          name="floor"
        />
        */}

        <FieldsSelectLabel
          placeholder="-- Trạng thái thuê --"
          labelSelect="Trạng thái thuê"
          data={[
            { label: "Còn trống", value: "AVAILABLE" },
            { label: "Đã thuê", value: "RENTED" },
          ]}
          value={rentalStatus}
          onChange={(value) => handleChange("rentalStatus", String(value))}
          name="rentalStatus"
        />
        <FieldsSelectLabel
          placeholder="-- Trạng thái hoạt động --"
          labelSelect="Trạng thái hoạt động"
          data={[
            { label: "Đang hoạt động", value: "ACTIVE" },
            { label: "Ngừng hoạt động", value: "INACTIVE" },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
        />
        <FieldsSelectLabel
          placeholder="-- Loại phòng --"
          labelSelect="Loại phòng"
          data={[
            { label: "Thường", value: "THUONG" },
            { label: "VIP", value: "VIP" },
          ]}
          value={roomType}
          onChange={(value) => handleChange("roomType", String(value))}
          name="roomType"
        />
        <InputLabel
          type="text"
          id="search"
          name="search"
          placeholder="Tìm kiếm phòng"
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default RoomFilter;
