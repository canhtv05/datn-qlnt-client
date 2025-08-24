import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import { useTenantOptions } from "@/services/contract";
import { AddTenantToContractRequest, ContractTenantDetailResponse } from "@/types";
import { Dispatch } from "react";

interface AddContractTenantProps {
  value: AddTenantToContractRequest;
  setValue: Dispatch<React.SetStateAction<AddTenantToContractRequest>>;
  errors: Partial<Record<keyof AddTenantToContractRequest, string>>;
  data?: ContractTenantDetailResponse[];
}

const AddContractTenant = ({ value, setValue, errors, data }: AddContractTenantProps) => {
  const tenantOptions = useTenantOptions().filter((t) => !data?.some((d) => d.tenantId === t.value));
  return (
    <div className="flex flex-col gap-3">
      <FieldsSelectLabel
        data={tenantOptions}
        placeholder={`Chọn khách thuê`}
        label={`Khách thuê:`}
        id="tenantId"
        name="tenantId"
        value={value.tenantId ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, tenantId: val as string }))}
        labelSelect={`Chọn khách thuê`}
        showClear
        required
        errorText={errors.tenantId}
      />
    </div>
  );
};

export default AddContractTenant;
