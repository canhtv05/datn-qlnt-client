import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import { useVehicleOptions } from "@/services/contract";
import { AddVehicleToContractRequest, ContractVehicleResponse } from "@/types";
import { Dispatch } from "react";

interface AddContractVehicleProps {
  value: AddVehicleToContractRequest;
  setValue: Dispatch<React.SetStateAction<AddVehicleToContractRequest>>;
  errors: Partial<Record<keyof AddVehicleToContractRequest, string>>;
  data?: ContractVehicleResponse[];
}

const AddContractVehicle = ({ value, setValue, errors, data }: AddContractVehicleProps) => {
  const vehicleOptions = useVehicleOptions().filter((t) => !data?.some((d) => d.vehicleId === t.value));
  return (
    <div className="flex flex-col gap-3">
      <FieldsSelectLabel
        data={vehicleOptions}
        placeholder={`Chọn phương tiện`}
        label={`Phương tiện:`}
        id="vehicleId"
        name="vehicleId"
        value={value.vehicleId ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, vehicleId: val as string }))}
        labelSelect={`Chọn phương tiện`}
        showClear
        required
        errorText={errors.vehicleId}
      />
    </div>
  );
};

export default AddContractVehicle;
