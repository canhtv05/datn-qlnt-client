import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { BuildingType } from "@/enums";
import { ICreateBuildingValue } from "@/types";
import { TFunction } from "i18next";
import { MapPin } from "lucide-react";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface AddOrUpdateBuildingProps {
  value: ICreateBuildingValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateBuildingValue>>;
  errors: Partial<Record<keyof ICreateBuildingValue, string>>;
  // address: ReactNode;
}

const buildingType = (t: TFunction<"translation", undefined>) => {
  return [
    {
      label: t("statusBadge.buildingType.nhaTro"),
      value: BuildingType.NHA_TRO,
    },
    {
      label: t("statusBadge.buildingType.canHoDichVu"),
      value: BuildingType.CAN_HO_DICH_VU,
    },
    {
      label: t("statusBadge.buildingType.chungCuMini"),
      value: BuildingType.CHUNG_CU_MINI,
    },
    {
      label: t("statusBadge.buildingType.other"),
      value: BuildingType.KHAC,
    },
  ];
};

const AddOrUpdateBuilding = ({ value, handleChange, setValue, errors }: AddOrUpdateBuildingProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <InputLabel
        id="buildingName"
        name="buildingName"
        placeholder={t("building.response.buildingName")}
        required
        label={t("building.addOrUpdate.buildingName")}
        value={value.buildingName ?? ""}
        onChange={handleChange}
        errorText={errors.buildingName}
      />

      {/* {AddressForm} */}

      <InputLabel
        id="address"
        name="address"
        placeholder={t("building.addOrUpdate.placeholderAddress")}
        required
        label={t("building.addOrUpdate.detailedAddress")}
        icon={<MapPin className="size-4" />}
        value={value.address ?? ""}
        onChange={handleChange}
        errorText={errors.address}
      />

      <FieldsSelectLabel
        data={buildingType(t)}
        placeholder={t("building.addOrUpdate.selectBuilding")}
        label={t("building.addOrUpdate.buildingType")}
        id="buildingType"
        name="buildingType"
        value={value.buildingType ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, buildingType: val as BuildingType }))}
        labelSelect={t("building.addOrUpdate.labelSelectBuildingType")}
        showClear
        errorText={errors.buildingType}
      />

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <InputLabel
          id="actualNumberOfFloors"
          name="actualNumberOfFloors"
          placeholder="1"
          required
          label={t("building.addOrUpdate.actualNumberOfFloors")}
          value={value.actualNumberOfFloors ?? ""}
          onChange={handleChange}
          errorText={errors.actualNumberOfFloors?.toString()}
        />

        <InputLabel
          id="numberOfFloorsForRent"
          name="numberOfFloorsForRent"
          placeholder="1"
          required
          label={t("building.addOrUpdate.numberOfFloorsForRent")}
          value={value.numberOfFloorsForRent ?? ""}
          onChange={handleChange}
          errorText={errors.numberOfFloorsForRent?.toString()}
        />
      </div>

      <TextareaLabel
        id="description"
        name="description"
        placeholder={t("building.addOrUpdate.placeholderDescription")}
        label={t("building.addOrUpdate.description")}
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default AddOrUpdateBuilding;
