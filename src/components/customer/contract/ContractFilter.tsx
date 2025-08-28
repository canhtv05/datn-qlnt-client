import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { ContractStatus } from "@/enums";
import { switchGrid2 } from "@/lib/utils";
import { ContractFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface ContractFilterProps {
  filterValues: ContractFilterValues;
  setFilterValues: Dispatch<SetStateAction<ContractFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const ContractFilter = ({
  props,
  type,
}: {
  props: ContractFilterProps;
  type: "default" | "restore";
}) => {
  const { t } = useTranslation();
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { status, query } = filterValues;

  const handleChange = (key: keyof ContractFilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid2(type)}>
        <RenderIf value={type === "default"}>
          <FieldsSelectLabel
            name="status"
            labelSelect={t("contract.response.status")}
            placeholder={t("contract.filter.placeholderStatus")}
            data={[
              { label: t("statusBadge.contractStatus.valid"), value: ContractStatus.HIEU_LUC },
              {
                label: t("statusBadge.contractStatus.expiring"),
                value: ContractStatus.SAP_HET_HAN,
              },
              {
                label: t("statusBadge.contractStatus.endedNotice"),
                value: ContractStatus.KET_THUC_CO_BAO_TRUOC,
              },
              {
                label: t("statusBadge.contractStatus.endedOnTime"),
                value: ContractStatus.KET_THUC_DUNG_HAN,
              },
              {
                label: t("statusBadge.contractStatus.terminated"),
                value: ContractStatus.TU_Y_HUY_BO,
              },
              { label: t("statusBadge.contractStatus.cancelled"), value: ContractStatus.DA_HUY },
            ]}
            value={status}
            onChange={(value) => handleChange("status", String(value))}
            showClear
          />
        </RenderIf>
        <InputLabel
          id="query"
          name="query"
          placeholder={t("contract.search")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default ContractFilter;
