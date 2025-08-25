import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { VehicleType } from "@/enums";
import { VehicleFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface VehicleFilterProps {
  filterValues: VehicleFilterValues;
  setFilterValues: Dispatch<SetStateAction<VehicleFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const VehicleFilter = ({ props }: { props: VehicleFilterProps }) => {
  const { t } = useTranslation();
  const { licensePlate, vehicleType } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof VehicleFilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder={t("vehicle.filter.placeholderType")}
          labelSelect={t("vehicle.response.vehicleType")}
          data={[
            { label: t("statusBadge.vehicleType.motorbike"), value: VehicleType.XE_MAY },
            { label: t("statusBadge.vehicleType.car"), value: VehicleType.O_TO },
            { label: t("statusBadge.vehicleType.bicycle"), value: VehicleType.XE_DAP },
            { label: t("statusBadge.vehicleType.other"), value: VehicleType.KHAC },
          ]}
          value={vehicleType}
          onChange={(value) => handleChange("vehicleType", String(value))}
          name="vehicleType"
          showClear
        />
        <InputLabel
          type="text"
          id="licensePlate"
          name="licensePlate"
          placeholder={t("vehicle.search")}
          value={licensePlate}
          onChange={(e) => handleChange("licensePlate", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default VehicleFilter;
