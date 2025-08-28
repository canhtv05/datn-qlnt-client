import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import { useVehicleOptions } from "@/services/contract";
import { AddVehicleToContractRequest, ContractVehicleResponse } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface AddContractVehicleProps {
  value: AddVehicleToContractRequest;
  setValue: Dispatch<React.SetStateAction<AddVehicleToContractRequest>>;
  errors: Partial<Record<keyof AddVehicleToContractRequest, string>>;
  data?: ContractVehicleResponse[];
}

const AddContractVehicle = ({ value, setValue, errors, data }: AddContractVehicleProps) => {
  const { t } = useTranslation();
  const vehicleOptions = useVehicleOptions().filter(
    (t) => !data?.some((d) => d.vehicleId === t.value)
  );
  return (
    <div className="flex flex-col gap-3">
      <FieldsSelectLabel
        data={vehicleOptions}
        placeholder={t("contract.filter.placeholderVehicle")}
        label={t("contract.response.vehicles")}
        id="vehicleId"
        name="vehicleId"
        value={value.vehicleId ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, vehicleId: val as string }))}
        labelSelect={t("contract.response.vehicles")}
        showClear
        required
        errorText={errors.vehicleId}
      />
    </div>
  );
};

export default AddContractVehicle;
