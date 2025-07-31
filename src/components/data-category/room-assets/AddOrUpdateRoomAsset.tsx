import { Dispatch } from "react";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetBeLongTo, AssetStatus, AssetType } from "@/enums";
import { AllRoomAssetFormValue, AssetResponse, ICreateAndUpdateBulkRoomAsset, Option, RoomAssetBulkFormValue, RoomAssetFormValue, RoomResponse } from "@/types";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { toast } from "sonner";

interface Props {
  value: RoomAssetFormValue;
  bulkValue: RoomAssetBulkFormValue;
  allRoomValue: AllRoomAssetFormValue;
  handleChange: <K extends keyof ICreateAndUpdateBulkRoomAsset>(field: K, newValue: ICreateAndUpdateBulkRoomAsset[K]) => void;
  setValue: Dispatch<React.SetStateAction<RoomAssetFormValue>>;
  setBulkValue: Dispatch<React.SetStateAction<RoomAssetBulkFormValue>>;
  setAllRoomValue: Dispatch<React.SetStateAction<AllRoomAssetFormValue>>;
  errors: Partial<Record<keyof RoomAssetFormValue, string>>;
  type: "default" | "bulkAdd" | 'update' | 'addToAllRoom';
  roomList: RoomResponse[] | [];
  assetsList: AssetResponse[] | [];
  currentAsset?: AssetResponse;
}

type AssetOption = FieldsSelectLabelType & {
  price: number;
  description: string;
};

const assetBeLongTo: FieldsSelectLabelType[] = [
  { label: "PHONG", value: AssetBeLongTo.PHONG },
  { label: "CA_NHAN", value: AssetBeLongTo.CA_NHAN },
];


const AddOrUpdateRoomAsset = ({ value, setValue, handleChange, errors, roomList, assetsList, type, bulkValue, setBulkValue, currentAsset, allRoomValue, setAllRoomValue }: Props) => {
  const toSelectType = (options: (AssetOption | FieldsSelectLabelType)[]): FieldsSelectLabelType[] =>
    options.map((o) => ({
      label: o.label,
      value: o.value,
    }));

  const roomOptions: FieldsSelectLabelType[] = roomList.map((room) => ({
    label: `${room.roomCode} - ${room.roomType}`,
    value: room.id,
  }));

  const assetOptions: AssetOption[] = assetsList.map((asset) => ({
    label: `${asset.nameAsset}`,
    value: asset.id,
    price: asset.price,
    description: asset.descriptionAsset,
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
      {type === "default" && (
        <div className="grid grid-cols-2 gap-4">
          <FieldsSelectLabel
            data={assetBeLongTo}
            placeholder="-- Chọn tài sản thuộc về --"
            label="Tài sản thuộc về:"
            id="assetBeLongTo"
            name="assetBeLongTo"
            value={value.assetBeLongTo ?? ""}
            onChange={(val) =>
              setValue((prev) => ({
                ...prev,
                assetBeLongTo: val as AssetBeLongTo,
              }))
            }
            labelSelect="Tài sản thuộc về"
            showClear
            errorText={errors.assetBeLongTo}
            required
          />

          <FieldsSelectLabel
            data={assetOptions}
            placeholder="-- Chọn tài sản --"
            label="Tài sản:"
            id="assetId"
            name="assetId"
            value={value.assetId ?? ""}
            onChange={(val) => {
              const selected = assetOptions.find((item) => item.value === val);
              if (selected) {
                setValue((prev) => ({
                  ...prev,
                  assetId: String(selected.value),
                  assetName: selected.label,
                  price: selected.price ?? 0,
                  description: selected.description ?? "",
                }));
              }
            }}
            labelSelect="Tài sản"
            showClear
            errorText={errors.assetId}
            required
            disabled={value.assetBeLongTo === "CA_NHAN"} // Disable if asset belongs to personal

          />

          <InputLabel
            id="assetName"
            name="assetName"
            type="text"
            placeholder="Tên tài sản"
            label="Tên tài sản:"
            required
            value={value.assetName ?? ""}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, assetName: e.target.value }))
            }
            errorText={errors.assetName}
            disabled={value.assetBeLongTo === "PHONG"}
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
            disabled={value.assetBeLongTo === "PHONG"}
          />


        </div>
      )}

      {type === "bulkAdd" && (
        <div className="grid grid-cols-2 gap-4">
          <FieldsMultiSelectLabel
            data={toSelectType(assetOptions)}
            placeholder="-- Chọn tài sản --"
            label="Tài sản:"
            id="assets"
            name="assets"
            value={toSelectType(assetOptions).filter((opt) =>
              Array.isArray(bulkValue.assetId)
                ? bulkValue.assetId.includes(String(opt.value))
                : false
            )}
            onChange={(selected) => {
              if (
                Array.isArray(bulkValue.roomId) &&
                bulkValue.roomId.length > 1 &&
                selected.length > 1
              ) {
                toast.error("Chỉ được chọn 1 tài sản nếu đã chọn nhiều phòng.");
                return;
              }

              setBulkValue((prev) => ({
                ...prev,
                assetId: selected.map((item) => String(item.value)),
              }));
            }}
            required
            errorText={errors.assetId}
          />

          <FieldsMultiSelectLabel
            data={toSelectType(roomOptions)}
            placeholder="-- Chọn phòng --"
            label="Phòng:"
            id="rooms"
            name="rooms"
            value={toSelectType(roomOptions).filter((opt) =>
              Array.isArray(bulkValue.roomId)
                ? bulkValue.roomId.includes(String(opt.value))
                : false
            )}
            onChange={(selected) => {
              if (
                Array.isArray(bulkValue.assetId) &&
                bulkValue.assetId.length > 1 &&
                selected.length > 1
              ) {
                toast.error("Chỉ được chọn 1 phòng nếu đã chọn nhiều tài sản.");
                return;
              }

              setBulkValue((prev) => ({
                ...prev,
                roomId: selected.map((item) => String(item.value)),
              }));
            }}
            required
            errorText={errors.roomId}
          />
        </div>
      )}

      {type === "update" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Nội dung phần cập nhật tùy bạn viết tiếp */}
          {/* Ví dụ như: */}
          <InputLabel
            id="assetName"
            name="assetName"
            type="text"
            placeholder="Tên tài sản"
            label="Tên tài sản:"
            required
            value={value.assetName ?? ""}
            onChange={(e) =>
              setValue((prev) => ({ ...prev, assetName: e.target.value }))
            }
            errorText={errors.assetName}
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

          <FieldsSelectLabel
            data={[
              {
                label: "Sử dụng",
                value: AssetStatus.SU_DUNG,
              },
              {
                label: "Cần bảo trì",
                value: AssetStatus.CAN_BAO_TRI,
              },
              {
                label: "Đã thanh lý",
                value: AssetStatus.DA_THANH_LY,
              },
              {
                label: "Hư hỏng",
                value: AssetStatus.HU_HONG,
              },
              {
                label: "Thất lạc",
                value: AssetStatus.THAT_LAC,
              },
            ]}
            placeholder="-- Chọn trạng thái tài sản --"
            label="Trạng thái tài sản:"
            id="assetStatus"
            name="assetStatus"
            value={value.assetStatus ?? ""}
            onChange={(val) => {
              setValue((prev) => ({ ...prev, assetStatus: val as AssetStatus }))
            }}
            labelSelect="Trạng thái tài sản"
            showClear
            errorText={errors.assetStatus}
            required
          />
        </div>
      )}

      {type === "addToAllRoom" && (
        <div className="grid grid-cols-2 gap-4">
          <FieldsSelectLabel
            data={assetOptions}
            placeholder="-- Chọn tài sản --"
            label="Tài sản:"
            id="assetId"
            name="assetId"
            value={allRoomValue.assetId ?? ""}
            onChange={(val) => setAllRoomValue((prev) => ({ ...prev, assetId: val as string }))}
            labelSelect="Tài sản"
            showClear
            errorText={errors.assetId}
            required
          />
        </div>
      )}



      {/* DESCRIPTION */}
      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả chi tiết"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
        disabled={value.assetBeLongTo === "PHONG"} // <-- add this
      />
    </div>
  );
};

export default AddOrUpdateRoomAsset;
