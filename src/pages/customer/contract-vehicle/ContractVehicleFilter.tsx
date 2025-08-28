import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { VehicleStatus, VehicleType } from "@/enums";
import { ContractVehicleFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface ContractTenantFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const ContractVehicleFilter = ({ props }: { props: ContractTenantFilterProps }) => {
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { t } = useTranslation();
  const { query, vehicleStatus, vehicleType } = filterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          name="vehicleStatus"
          labelSelect={t("contract.contract.status")}
          placeholder={t("contract.filter.placeholderStatus")}
          data={[
            {
              label: t("statusBadge.vehicleStatus.active"),
              value: VehicleStatus.SU_DUNG,
            },
            {
              label: t("statusBadge.vehicleStatus.inactive"),
              value: VehicleStatus.KHONG_SU_DUNG,
            },
          ]}
          value={vehicleStatus}
          onChange={(value) => handleChange("vehicleStatus", String(value))}
          showClear
        />
        <FieldsSelectLabel
          name="vehicleType"
          labelSelect={t("vehicle.response.vehicleType")}
          placeholder={t("vehicle.filter.placeholderType")}
          data={[
            {
              label: t("statusBadge.vehicleType.car"),
              value: VehicleType.O_TO,
            },
            {
              label: t("statusBadge.vehicleType.motorbike"),
              value: VehicleType.XE_MAY,
            },
            {
              label: t("statusBadge.vehicleType.bicycle"),
              value: VehicleType.XE_DAP,
            },
            {
              label: t("statusBadge.vehicleType.other"),
              value: VehicleType.KHAC,
            },
          ]}
          value={vehicleType}
          onChange={(value) => handleChange("vehicleType", String(value))}
          showClear
        />
        <InputLabel
          id="query"
          name="query"
          placeholder={t("tenant.search")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default ContractVehicleFilter;
