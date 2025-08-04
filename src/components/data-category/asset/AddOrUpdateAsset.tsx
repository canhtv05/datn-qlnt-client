import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetBeLongTo, AssetStatus, AssetType } from "@/enums";
import { ApiResponse, CreateAssetInit2Response, ICreateAsset, IUpdateAsset } from "@/types";
import { Dispatch } from "react";

interface CreateAssetProps {
  value: ICreateAsset;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateAsset>>;
  errors: Partial<Record<keyof ICreateAsset, string>>;
  assetsInfo?: ApiResponse<CreateAssetInit2Response>;
  type: "add";
}

interface UpdateAssetProps {
  value: IUpdateAsset;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<IUpdateAsset>>;
  errors: Partial<Record<keyof IUpdateAsset, string>>;
  assetsInfo?: ApiResponse<CreateAssetInit2Response>;
  type: "update";
}

type Props = CreateAssetProps | UpdateAssetProps;

const assetBeLongTo: FieldsSelectLabelType[] = [
  {
    label: "Chung",
    value: AssetBeLongTo.CHUNG,
  },
  {
    label: "Phòng",
    value: AssetBeLongTo.PHONG,
  },
];

const assetType: FieldsSelectLabelType[] = [
  {
    label: "Gia dụng",
    value: AssetType.GIA_DUNG,
  },
  {
    label: "Vệ sinh",
    value: AssetType.VE_SINH,
  },
  {
    label: "Nội thất",
    value: AssetType.NOI_THAT,
  },
  {
    label: "Điện",
    value: AssetType.DIEN,
  },
  {
    label: "An ninh",
    value: AssetType.AN_NINH,
  },
  {
    label: "Khác",
    value: AssetType.KHAC,
  },
];

const AddOrUpdateAsset = ({ value, handleChange, setValue, errors, type }: Props) => {
  // const hasAnyLocationSelected = !!value.tenantId || !!value.buildingID || !!value.floorID || !!value.roomID;

  // const buildingOptions = useMemo(() => {
  //   return (
  //     assetsInfo?.data.buildings?.map((item) => ({
  //       label: item.name,
  //       value: item.id,
  //     })) ?? []
  //   );
  // }, [assetsInfo?.data.buildings]);

  // const floorOptions = useMemo(() => {
  //   return (
  //     assetsInfo?.data?.floors?.map((f) => ({
  //       label: f.name,
  //       value: f.id,
  //     })) ?? []
  //   );
  // }, [assetsInfo?.data?.floors]);

  // const roomOptions = useMemo(() => {
  //   return (
  //     assetsInfo?.data?.rooms?.map((r) => ({
  //       label: r.name,
  //       value: r.id,
  //     })) ?? []
  //   );
  // }, [assetsInfo?.data?.rooms]);

  // const tenantOptions = useMemo(() => {
  //   return (
  //     assetsInfo?.data?.tenants?.map((t) => ({
  //       label: t.name,
  //       value: t.id,
  //     })) ?? []
  //   );
  // }, [assetsInfo?.data?.tenants]);

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

      {/* <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
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
          disabled={hasAnyLocationSelected && !value.buildingID}
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
          disabled={hasAnyLocationSelected && !value.floorID}
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
          disabled={hasAnyLocationSelected && !value.roomID}
        />
      </div> */}

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          data={assetType}
          placeholder="-- Chọn loại tài sản --"
          label="Loại tài sản:"
          id="assetType"
          name="assetType"
          value={value.assetType ?? ""}
          onChange={(val) => {
            if (type === "update") setValue((prev) => ({ ...prev, assetType: val as string }));
            else setValue((prev) => ({ ...prev, assetType: val as string }));
          }}
          labelSelect="Loại tài sản"
          showClear
          errorText={errors.assetType}
          required
        />

        <FieldsSelectLabel
          data={assetBeLongTo}
          placeholder="-- Chọn tài sản thuộc về --"
          label="Tài sản thuộc về:"
          id="assetBeLongTo"
          name="assetBeLongTo"
          value={value.assetBeLongTo ?? ""}
          onChange={(val) => {
            if (type === "add") setValue((prev) => ({ ...prev, assetBeLongTo: val as AssetBeLongTo }));
            else setValue((prev) => ({ ...prev, assetBeLongTo: val as AssetBeLongTo }));
          }}
          labelSelect="Tài sản thuộc về"
          showClear
          errorText={errors.assetBeLongTo}
          required
        />

        {/* <FieldsSelectLabel
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
          disabled={hasAnyLocationSelected && !value.tenantId}
        /> */}
      </div>

      {type === "update" && (
        <FieldsSelectLabel
          data={[
            {
              label: "Hoạt động",
              value: AssetStatus.HOAT_DONG,
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
            {
              label: "Không sử dụng",
              value: AssetStatus.KHONG_SU_DUNG,
            },
            {
              label: "Hủy",
              value: AssetStatus.HUY,
            },
          ]}
          placeholder="-- Chọn trạng thái --"
          label="Trạng thái:"
          id="assetStatus"
          name="assetStatus"
          value={value.assetStatus ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, assetStatus: val as AssetStatus }))}
          labelSelect="Trạng thái"
          showClear
          errorText={errors.assetStatus}
          required
        />
      )}

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
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
        <InputLabel
          type="number"
          id="quantity"
          name="quantity"
          placeholder="1"
          required
          label="Số lượng:"
          value={value.quantity ?? ""}
          onChange={handleChange}
          errorText={errors.quantity}
        />
      </div>

      <TextareaLabel
        id="descriptionAsset"
        name="descriptionAsset"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.descriptionAsset ?? ""}
        onChange={(e) => {
          if (type === "add") setValue((prev) => ({ ...prev, descriptionAsset: e.target.value }));
          else setValue((prev) => ({ ...prev, descriptionAsset: e.target.value }));
        }}
        errorText={errors.descriptionAsset}
      />
    </div>
  );
};

export default AddOrUpdateAsset;
