import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetBeLongTo } from "@/enums";
import { ApiResponse, CreateAssetInitResponse, ICreateAsset } from "@/types";
import { Dispatch, useMemo } from "react";

interface AddOrUpdateAssetProps {
  value: ICreateAsset;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateAsset>>;
  errors: Partial<Record<keyof ICreateAsset, string>>;
  assetsInfo?: ApiResponse<CreateAssetInitResponse>;
}

const assetBeLongTo: FieldsSelectLabelType[] = [
  {
    label: "Cá nhân",
    value: AssetBeLongTo.CA_NHAN,
  },
  {
    label: "Chung",
    value: AssetBeLongTo.CHUNG,
  },
  {
    label: "Phòng",
    value: AssetBeLongTo.PHONG,
  },
];

const AddOrUpdateAsset = ({ value, handleChange, setValue, errors, assetsInfo }: AddOrUpdateAssetProps) => {
  const assetTypeOptions = useMemo(() => {
    return (
      assetsInfo?.data.assetTypes?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [assetsInfo?.data.assetTypes]);

  const buildingOptions = useMemo(() => {
    return (
      assetsInfo?.data.buildings?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [assetsInfo?.data.buildings]);

  const floorOptions = useMemo(() => {
    const selectedBuilding = assetsInfo?.data.buildings?.find((b) => b.id === value.buildingID);
    return (
      selectedBuilding?.floors?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? []
    );
  }, [assetsInfo?.data.buildings, value.buildingID]);

  const roomOptions = useMemo(() => {
    const selectedBuilding = assetsInfo?.data.buildings?.find((b) => b.id === value.buildingID);
    const selectedFloor = selectedBuilding?.floors?.find((f) => f.id === value.floorID);
    return (
      selectedFloor?.rooms?.map((r) => ({
        label: r.name,
        value: r.id,
      })) ?? []
    );
  }, [assetsInfo?.data.buildings, value.buildingID, value.floorID]);

  const tenantOptions = useMemo(() => {
    const selectedBuilding = assetsInfo?.data.buildings?.find((b) => b.id === value.buildingID);
    const selectedFloor = selectedBuilding?.floors?.find((f) => f.id === value.floorID);
    const selectedRoom = selectedFloor?.rooms?.find((r) => r.id === value.roomID);

    return (
      selectedRoom?.tenants?.map((t) => ({
        label: t.name,
        value: t.id,
      })) ?? []
    );
  }, [assetsInfo?.data.buildings, value.buildingID, value.floorID, value.roomID]);

  return (
    <div className="flex flex-col gap-3">
      <InputLabel
        id="nameAsset"
        name="nameAsset"
        placeholder="Điều hòa"
        required
        label="Tên tài sản:"
        value={value.nameAsset ?? ""}
        onChange={handleChange}
        errorText={errors.nameAsset}
      />

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          data={buildingOptions}
          placeholder="-- Chọn tòa nhà --"
          label="Tòa nhà:"
          id="buildingID"
          name="buildingID"
          value={value.buildingID ?? ""}
          onChange={(val) =>
            setValue((prev) => ({
              ...prev,
              buildingID: val as string,
              floorID: "",
              roomID: "",
            }))
          }
          labelSelect="Tòa nhà"
          showClear
          errorText={errors.buildingID}
          required
        />

        <FieldsSelectLabel
          data={floorOptions}
          placeholder="-- Chọn tầng --"
          label="Tầng:"
          id="floorID"
          name="floorID"
          value={value.floorID ?? ""}
          onChange={(val) =>
            setValue((prev) => ({
              ...prev,
              floorID: val as string,
              roomID: "",
            }))
          }
          labelSelect="Tầng"
          showClear
          errorText={errors.floorID}
          required
        />

        <FieldsSelectLabel
          data={roomOptions}
          placeholder="-- Chọn phòng --"
          label="Phòng:"
          id="roomID"
          name="roomID"
          value={value.roomID ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, roomID: val as string }))}
          labelSelect="Phòng"
          showClear
          errorText={errors.roomID}
          required
        />
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          data={assetTypeOptions}
          placeholder="-- Chọn loại tài sản --"
          label="Loại tài sản:"
          id="assetTypeId"
          name="assetTypeId"
          value={value.assetTypeId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, assetTypeId: val as string }))}
          labelSelect="Loại tài sản"
          showClear
          errorText={errors.assetTypeId}
          required
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

        <FieldsSelectLabel
          data={tenantOptions}
          placeholder="-- Chọn khách thuê --"
          label="Khách thuê:"
          id="tenantId"
          name="tenantId"
          value={value.tenantId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, tenantId: val as string }))}
          labelSelect="Khách thuê"
          showClear
          errorText={errors.tenantId}
          required
        />
      </div>

      <InputLabel
        type="number"
        id="price"
        name="price"
        placeholder="1"
        required
        label="Giá trị (VND):"
        value={value.price ?? ""}
        onChange={handleChange}
        errorText={errors.price}
      />

      <TextareaLabel
        id="descriptionAsset"
        name="descriptionAsset"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.descriptionAsset ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, descriptionAsset: e.target.value }))}
        errorText={errors.descriptionAsset}
      />
    </div>
  );
};

export default AddOrUpdateAsset;
