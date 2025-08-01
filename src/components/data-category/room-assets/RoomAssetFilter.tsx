import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { RoomStatus, RoomType } from "@/enums";
import { AssetRoomFilter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface RoomFilterProps {
  filterValues: AssetRoomFilter;
  setFilterValues: Dispatch<SetStateAction<AssetRoomFilter>>;
  onClear: () => void;
  onFilter: () => void;
}

const RoomAssetFilter = ({ props }: { props: RoomFilterProps }) => {
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { status, roomType, query } = filterValues;

  const handleChange = (key: keyof AssetRoomFilter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end rounded-t-sm" onSubmit={handleSubmit}>
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

      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default RoomAssetFilter;
