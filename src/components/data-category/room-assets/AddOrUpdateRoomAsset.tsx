import { Dispatch } from "react";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetBeLongTo, AssetStatus, RoomType } from "@/enums";
import {
  AllRoomAssetFormValue,
  AssetResponse,
  ICreateAndUpdateBulkRoomAsset,
  RoomAssetBulkFormValue,
  RoomAssetFormValue,
  RoomResponse,
} from "@/types";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { toast } from "sonner";
import RenderIf from "@/components/RenderIf";
import { formattedCurrency } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface Props {
  value: RoomAssetFormValue;
  bulkValue: RoomAssetBulkFormValue;
  allRoomValue: AllRoomAssetFormValue;
  handleChange: <K extends keyof ICreateAndUpdateBulkRoomAsset>(
    field: K,
    newValue: ICreateAndUpdateBulkRoomAsset[K]
  ) => void;
  setValue: Dispatch<React.SetStateAction<RoomAssetFormValue>>;
  setBulkValue: Dispatch<React.SetStateAction<RoomAssetBulkFormValue>>;
  setAllRoomValue: Dispatch<React.SetStateAction<AllRoomAssetFormValue>>;
  errors: Partial<Record<keyof RoomAssetFormValue, string>>;
  type: "default" | "bulkAdd" | "update" | "addToAllRoom";
  roomList: RoomResponse[] | [];
  assetsList: AssetResponse[] | [];
  currentAsset?: AssetResponse;
  buildingOptions: FieldsSelectLabelType[] | undefined;
}

type AssetOption = FieldsSelectLabelType & {
  price: number;
  description: string;
};

const AddOrUpdateRoomAsset = ({
  value,
  setValue,
  errors,
  roomList,
  assetsList,
  type,
  bulkValue,
  setBulkValue,
  allRoomValue,
  buildingOptions,
  setAllRoomValue,
}: Props) => {
  const { t } = useTranslation();
  const assetBeLongTo: FieldsSelectLabelType[] = [
    { label: t("statusBadge.assetBelongTo.room"), value: AssetBeLongTo.PHONG },
    { label: t("statusBadge.assetBelongTo.personal"), value: AssetBeLongTo.CA_NHAN },
  ];

  const switchRoomType = (roomType: RoomType) => {
    switch (roomType) {
      case RoomType.CAO_CAP:
        return t("statusBadge.roomType.vip");
      case RoomType.DON:
        return t("statusBadge.roomType.single");
      case RoomType.GHEP:
        return t("statusBadge.roomType.shared");
      case RoomType.KHAC:
        return t("statusBadge.roomType.other");
    }
  };

  const toSelectType = (
    options: (AssetOption | FieldsSelectLabelType)[]
  ): FieldsSelectLabelType[] =>
    options.map((o) => ({
      label: o.label,
      value: o.value,
    }));

  const roomOptions: FieldsSelectLabelType[] = roomList.map((room) => ({
    label: `${room.roomCode} - ${switchRoomType(room.roomType)}`,
    value: room.id,
  }));

  const assetOptions: AssetOption[] = assetsList
    .filter((asset) => asset.remainingQuantity > 0)
    .map((asset) => ({
      label: t("roomAsset.labelFormat", {
        name: asset.nameAsset,
        remaining: asset.remainingQuantity || 0,
        price: formattedCurrency(asset.price),
      }),
      value: asset.id,
      price: asset.price,
      description: asset.description,
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
        <>
          <FieldsSelectLabel
            data={assetBeLongTo}
            placeholder={t("roomAsset.addOrUpdate.placeholderAssetBeLongTo")}
            label={t("roomAsset.addOrUpdate.assetBeLongTo")}
            id="assetBeLongTo"
            name="assetBeLongTo"
            value={value.assetBeLongTo ?? ""}
            onChange={(val) =>
              setValue((prev) => ({
                ...prev,
                assetBeLongTo: val as AssetBeLongTo,
              }))
            }
            labelSelect={t("roomAsset.addOrUpdate.assetBeLongTo")}
            showClear
            errorText={errors.assetBeLongTo}
            required
          />

          <FieldsSelectLabel
            data={assetOptions}
            placeholder={t("roomAsset.addOrUpdate.placeholderAsset")}
            label={t("roomAsset.addOrUpdate.assetBeLongTo")}
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
            labelSelect={t("roomAsset.addOrUpdate.assetBeLongTo")}
            showClear
            errorText={errors.assetId}
            required
            disabled={value.assetBeLongTo === "CA_NHAN"} // Disable if asset belongs to personal
          />

          <InputLabel
            id="assetName"
            name="assetName"
            type="text"
            placeholder={t("roomAsset.addOrUpdate.nameAsset")}
            label={t("roomAsset.addOrUpdate.nameAsset")}
            required
            value={value.assetName ?? ""}
            onChange={(e) => setValue((prev) => ({ ...prev, assetName: e.target.value }))}
            errorText={errors.assetName}
            disabled={value.assetBeLongTo === "PHONG"}
          />

          <InputLabel
            id="price"
            name="price"
            type="number"
            placeholder="100000"
            label={t("roomAsset.addOrUpdate.price")}
            required
            value={value.price ?? ""}
            onChange={handleNumberChange}
            errorText={errors.price}
            disabled={value.assetBeLongTo === "PHONG"}
          />
        </>
      )}
      {type === "bulkAdd" && (
        <>
          <FieldsMultiSelectLabel
            data={toSelectType(assetOptions)}
            placeholder={t("roomAsset.addOrUpdate.placeholderAsset")}
            label={t("roomAsset.addOrUpdate.placeholderAsset")}
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
                toast.error(t("roomAsset.error.onlyOneAsset"));
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
            placeholder={t("roomAsset.addOrUpdate.placeholderRoom")}
            label={t("roomAsset.addOrUpdate.labelRoom")}
            id="rooms"
            name="rooms"
            value={toSelectType(roomOptions).filter((opt) =>
              Array.isArray(bulkValue.roomId) ? bulkValue.roomId.includes(String(opt.value)) : false
            )}
            onChange={(selected) => {
              if (
                Array.isArray(bulkValue.assetId) &&
                bulkValue.assetId.length > 1 &&
                selected.length > 1
              ) {
                toast.error(t("roomAsset.error.onlyOneRoom"));
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
        </>
      )}
      {type === "update" && (
        <>
          <InputLabel
            id="assetName"
            name="assetName"
            type="text"
            placeholder={t("roomAsset.addOrUpdate.assetName")}
            label={t("roomAsset.addOrUpdate.assetName")}
            required
            value={value.assetName ?? ""}
            onChange={(e) => setValue((prev) => ({ ...prev, assetName: e.target.value }))}
            errorText={errors.assetName}
          />

          <InputLabel
            id="price"
            name="price"
            type="number"
            placeholder={t("roomAsset.addOrUpdate.placeholderPrice")}
            label={t("roomAsset.addOrUpdate.price")}
            required
            value={value.price ?? ""}
            onChange={handleNumberChange}
            errorText={errors.price}
          />
        </>
      )}
      {type === "addToAllRoom" && type !== "addToAllRoom" && (
        <FieldsSelectLabel
          data={buildingOptions ?? []}
          placeholder={t("roomAsset.addOrUpdate.placeholderBuilding")}
          label={t("roomAsset.addOrUpdate.labelBuilding")}
          id="buildingId"
          name="buildingId"
          value={allRoomValue.buildingId ?? ""}
          onChange={(val) => {
            setAllRoomValue((prev) => ({ ...prev, buildingId: val as string }));
          }}
          labelSelect={t("roomAsset.addOrUpdate.labelBuilding")}
          showClear
          errorText={errors.buildingId}
          required
        />
      )}
      <RenderIf value={type === "update"}>
        <FieldsSelectLabel
          data={[
            {
              label: t("statusBadge.assetStatus.active"),
              value: AssetStatus.HOAT_DONG,
            },
            {
              label: t("statusBadge.assetStatus.maintenance"),
              value: AssetStatus.CAN_BAO_TRI,
            },
            {
              label: t("statusBadge.assetStatus.liquidated"),
              value: AssetStatus.DA_THANH_LY,
            },
            {
              label: t("statusBadge.assetStatus.broken"),
              value: AssetStatus.HU_HONG,
            },
            {
              label: t("statusBadge.assetStatus.lost"),
              value: AssetStatus.THAT_LAC,
            },
            {
              label: t("statusBadge.assetStatus.inactive"),
              value: AssetStatus.KHONG_SU_DUNG,
            },
            {
              label: t("statusBadge.assetStatus.cancelled"),
              value: AssetStatus.HUY,
            },
          ]}
          placeholder={t("roomAsset.addOrUpdate.placeholderAssetStatus")}
          label={t("roomAsset.addOrUpdate.assetStatus")}
          id="assetStatus"
          name="assetStatus"
          value={value.assetStatus ?? ""}
          onChange={(val) => {
            setValue((prev) => ({ ...prev, assetStatus: val as AssetStatus }));
          }}
          labelSelect={t("roomAsset.addOrUpdate.assetStatus")}
          showClear
          errorText={errors.assetStatus}
          required
        />
      </RenderIf>
      {type === "addToAllRoom" && (
        <FieldsSelectLabel
          data={assetOptions}
          placeholder={t("roomAsset.addOrUpdate.placeholderAsset")}
          label={t("roomAsset.addOrUpdate.labelAsset")}
          id="assetId"
          name="assetId"
          value={allRoomValue.assetId ?? ""}
          onChange={(val) => setAllRoomValue((prev) => ({ ...prev, assetId: val as string }))}
          labelSelect={t("roomAsset.addOrUpdate.labelAsset")}
          showClear
          errorText={errors.assetId}
          required
        />
      )}
      <RenderIf value={type === "default"}>
        <InputLabel
          id="quantity"
          name="quantity"
          type="number"
          placeholder={t("roomAsset.addOrUpdate.placeholderQuantity")}
          label={t("roomAsset.addOrUpdate.quantity")}
          required
          value={value.quantity ?? ""}
          onChange={handleNumberChange}
          errorText={errors.quantity}
          disabled={value.assetBeLongTo === "PHONG"}
        />
      </RenderIf>
      <RenderIf value={type !== "bulkAdd" && type !== "addToAllRoom"}>
        <TextareaLabel
          id="description"
          name="description"
          placeholder={t("roomAsset.addOrUpdate.placeholderDescription")}
          label={t("roomAsset.addOrUpdate.descriptionAsset")}
          value={value.description ?? ""}
          onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
          disabled={value.assetBeLongTo === "PHONG"} // <-- add this
        />
      </RenderIf>
      <RenderIf value={type === "bulkAdd"}>
        <span className="mt-2 text-[12px]">
          <span className="text-red-500 font-medium">(*) </span>
          {t("roomAsset.bulkAddGuide.title")}
          <ol className="list-decimal list-inside ml-2">
            <li>{t("roomAsset.bulkAddGuide.option1")}</li>
            <li>{t("roomAsset.bulkAddGuide.option2")}</li>
          </ol>
        </span>
      </RenderIf>
    </div>
  );
};

export default AddOrUpdateRoomAsset;
