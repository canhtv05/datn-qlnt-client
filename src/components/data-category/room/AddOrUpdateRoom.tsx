import { Dispatch } from "react";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { RoomStatus, RoomType } from "@/enums";
import { RoomFormValue } from "@/types";

interface Props {
  value: RoomFormValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<RoomFormValue>>;
  errors: Partial<Record<keyof RoomFormValue, string>>;
}

const roomTypes: FieldsSelectLabelType[] = [
  { label: "Phòng ghép", value: RoomType.GHEP },
  { label: "Phòng đơn", value: RoomType.DON },
  { label: "Khác", value: RoomType.KHAC },
];

const roomStatuses: FieldsSelectLabelType[] = [
  { label: "Còn trống", value: RoomStatus.TRONG },
  { label: "Đã thuê", value: RoomStatus.DA_THUE },
  { label: "Đặt cọc", value: RoomStatus.DA_DAT_COC },
  { label: "Bảo trì", value: RoomStatus.DANG_BAO_TRI },
];

const AddOrUpdateRoom = ({ value, setValue, errors }: Props) => {
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputVal } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: inputVal === "" ? null : Number(inputVal),
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        {/* FLOOR ID */}
        {/* <InputLabel
          id="floorId"
          name="floorId"
          placeholder="Nhập ID tầng"
          label="Tầng:"
          required
          value={value.floorId}
          onChange={handleChange}
          errorText={errors.floorId}
        /> */}

        {/* ROOM CODE */}
        {/* Nếu roomCode không cần nhập thì có thể bỏ đi */}
        {/* <InputLabel
          id="roomCode"
          name="roomCode"
          placeholder="P101"
          label="Mã phòng:"
          required
          value={value.roomCode}
          onChange={handleChange}
          errorText={errors.roomCode}
        /> */}

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
          onChange={(val) =>
            setValue((prev) => ({ ...prev, roomType: val as RoomType }))
          }
          labelSelect="Loại phòng"
          showClear
          errorText={errors.roomType}
        />

        {/* STATUS */}
        <FieldsSelectLabel
          data={roomStatuses}
          placeholder="-- Chọn trạng thái --"
          label="Trạng thái:"
          id="roomstatus"
          name="roomstatus"
          value={value.roomstatus ?? ""}
          onChange={(val) =>
            setValue((prev) => ({ ...prev, status: val as RoomStatus }))
          }
          labelSelect="Trạng thái"
          showClear
          errorText={errors.roomstatus}
        />
      </div>

      {/* DESCRIPTION */}
      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả chi tiết"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) =>
          setValue((prev) => ({ ...prev, description: e.target.value }))
        }
      />
    </div>
  );
};

export default AddOrUpdateRoom;
