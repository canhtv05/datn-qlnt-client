import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import { useTenantOptions } from "@/services/contract";
import { AddTenantToContractRequest, ContractTenantDetailResponse } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface AddContractTenantProps {
  value: AddTenantToContractRequest;
  setValue: Dispatch<React.SetStateAction<AddTenantToContractRequest>>;
  errors: Partial<Record<keyof AddTenantToContractRequest, string>>;
  data?: ContractTenantDetailResponse[];
}

const AddContractTenant = ({ value, setValue, errors, data }: AddContractTenantProps) => {
  const { t } = useTranslation();
  const tenantOptions = useTenantOptions().filter(
    (t) => !data?.some((d) => d.tenantId === t.value)
  );
  return (
    <div className="flex flex-col gap-3">
      <FieldsSelectLabel
        data={tenantOptions}
        placeholder={t("contract.filter.placeholderTenant")}
        label={t("contract.response.tenants")}
        id="tenantId"
        name="tenantId"
        value={value.tenantId ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, tenantId: val as string }))}
        labelSelect={t("contract.filter.placeholderTenant")}
        showClear
        required
        errorText={errors.tenantId}
      />
    </div>
  );
};

export default AddContractTenant;
