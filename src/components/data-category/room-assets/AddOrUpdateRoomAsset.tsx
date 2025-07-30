import { Dispatch } from "react";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetBeLongTo } from "@/enums";
import { AssetResponse, RoomAssetFormValue, RoomResponse } from "@/types";

interface Props {
  value: RoomAssetFormValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<RoomAssetFormValue>>;
  errors: Partial<Record<keyof RoomAssetFormValue, string>>;
  roomList: RoomResponse[];
  assetsList: AssetResponse[];
}

const assetBeLongTo: FieldsSelectLabelType[] = [
  { label: "PHONG", value: AssetBeLongTo.PHONG },
  { label: "CHUNG", value: AssetBeLongTo.CHUNG },
];

const AddOrUpdateRoomAsset = ({ value, setValue, errors, roomList, assetsList }: Props) => {
  const roomOptions: FieldsSelectLabelType[] = roomList.map((room) => ({
    label: `${room.roomCode} - ${room.roomType}`,
    value: room.id,
  }));

  const assetOptions: FieldsSelectLabelType[] = assetsList.map((asset) => ({
    label: `${asset.nameAsset}`,
    value: asset.id,
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
        <FieldsSelectLabel
          data={roomOptions}
          placeholder="-- Chọn phòng --"
          label="Phòng:"
          id="roomId"
          name="roomId"
          value={value.roomId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, roomId: val as string }))}
          labelSelect="Phòng"
          showClear
          errorText={errors.roomId}
        />

        <InputLabel
          id="assetName"
          name="assetName"
          type="text"
          placeholder="Tên tài sản"
          label="Tên tài sản:"
          required
          value={value.assetName ?? ""}
          onChange={(e) => setValue((prev) => ({ ...prev, assetName: e.target.value }))}
          errorText={errors.assetName}
        />


        <FieldsSelectLabel
          data={assetBeLongTo}
          placeholder="-- Chọn tài sản thuộc về --"
          label="Tài sản thuộc về:"
          id="assetBeLongTo"
          name="assetBeLongTo"
          value={value.assetBeLongTo ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, assetBeLongTo: val as AssetBeLongTo }))}
          labelSelect="Tài sản thuộc về"
          showClear
          errorText={errors.assetBeLongTo}
          required
        />

        <InputLabel
          id="price"
          name="price"
          type="number"
          placeholder="Enter Price"
          label="Price:"
          required
          value={value.price ?? ""}
          onChange={handleNumberChange}
          errorText={errors.price}
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

export default AddOrUpdateRoomAsset;
