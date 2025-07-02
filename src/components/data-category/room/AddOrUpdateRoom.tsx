import { Dispatch } from "react";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { RoomStatus, RoomType } from "@/enums";
import { RoomFormValue, FloorBasicResponse } from "@/types";

interface Props {
  value: RoomFormValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<RoomFormValue>>;
  errors: Partial<Record<keyof RoomFormValue, string>>;
  floorList: FloorBasicResponse[];
}

const roomTypes: FieldsSelectLabelType[] = [
  { label: "Phòng ghép", value: RoomType.GHEP },
  { label: "Phòng đơn", value: RoomType.DON },
  { label: "Khác", value: RoomType.KHAC },
];

const roomStatuses: FieldsSelectLabelType[] = [
  { label: "Còn trống", value: RoomStatus.TRONG },
  { label: "Đã thuê", value: RoomStatus.DANG_THUE },
  { label: "Đặt cọc", value: RoomStatus.DA_DAT_COC },
  { label: "Bảo trì", value: RoomStatus.DANG_BAO_TRI },
  { label: "Chưa hoàn thiện", value: RoomStatus.CHUA_HOAN_THIEN },
  { label: "Tạm khóa", value: RoomStatus.TAM_KHOA },
];

const AddOrUpdateRoom = ({ value, setValue, errors, floorList }: Props) => {
  const floorOptions: FieldsSelectLabelType[] = floorList.map((floor) => ({
    label: `${floor.nameFloor} - ${floor.buildingName}`,
    value: floor.id,
  }));

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputVal } = e.target;
    const parsed = Number(inputVal.trim());
    setValue((prev) => ({
      ...prev,
      [name]: inputVal.trim() === "" || isNaN(parsed) ? null : parsed,
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        {/* FLOOR ID */}
        <FieldsSelectLabel
          data={floorOptions}
          placeholder="-- Chọn tầng --"
          label="Tầng:"
          id="floorId"
          name="floorId"
          value={value.floorId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, floorId: val as string }))}
          labelSelect="Tầng"
          showClear
          errorText={errors.floorId}
        />

        {/* ACREAGE */}
        <InputLabel
          id="acreage"
          name="acreage"
          placeholder="30"
          type="number"
          label="Diện tích (m²):"
          required
          value={value.acreage ?? ""}
          onChange={handleNumberChange}
          errorText={errors.acreage}
        />

        {/* PRICE */}
        <InputLabel
          id="price"
          name="price"
          placeholder="3000000"
          type="number"
          label="Giá (VNĐ):"
          required
          value={value.price ?? ""}
          onChange={handleNumberChange}
          errorText={errors.price}
        />

        {/* MAXIMUM PEOPLE */}
        <InputLabel
          id="maximumPeople"
          name="maximumPeople"
          placeholder="4"
          type="number"
          label="Số người tối đa:"
          required
          value={value.maximumPeople ?? ""}
          onChange={handleNumberChange}
          errorText={errors.maximumPeople}
        />

        {/* ROOM TYPE */}
        <FieldsSelectLabel
          data={roomTypes}
          placeholder="-- Chọn loại phòng --"
          label="Loại phòng:"
          id="roomType"
          name="roomType"
          value={value.roomType ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, roomType: val as RoomType }))}
          labelSelect="Loại phòng"
          showClear
          errorText={errors.roomType}
        />

        {/* STATUS */}
        <FieldsSelectLabel
          data={roomStatuses}
          placeholder="-- Chọn trạng thái --"
          label="Trạng thái:"
          id="status"
          name="status"
          value={value.status ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, status: val as RoomStatus }))}
          labelSelect="Trạng thái"
          showClear
          errorText={errors.status}
        />
      </div>

      {/* DESCRIPTION */}
      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả chi tiết"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default AddOrUpdateRoom;
