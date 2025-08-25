import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { GENDER_OPTIONS } from "@/constant";
import { TenantStatus } from "@/enums";
import { switchGrid3 } from "@/lib/utils";
import { TenantFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface TenantFilterProps {
  filterValues: TenantFilterValues;
  setFilterValues: Dispatch<SetStateAction<TenantFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const TenantFilter = ({
  props,
  type,
}: {
  props: TenantFilterProps;
  type: "default" | "restore";
}) => {
  const { t } = useTranslation();
  const { gender, query, tenantStatus } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof TenantFilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid3(type)}>
        <RenderIf value={type === "default"}>
          <FieldsSelectLabel
            placeholder={t("tenant.filter.tenantStatus")}
            labelSelect={t("tenant.response.tenantStatus")}
            data={[
              { label: t("statusBadge.tenantStatus.renting"), value: TenantStatus.DANG_THUE },
              { label: t("statusBadge.tenantStatus.returned"), value: TenantStatus.DA_TRA_PHONG },
              {
                label: t("statusBadge.tenantStatus.waitContract"),
                value: TenantStatus.CHO_TAO_HOP_DONG,
              },
              { label: t("statusBadge.tenantStatus.locked"), value: TenantStatus.KHOA },
            ]}
            value={tenantStatus}
            onChange={(value) => handleChange("tenantStatus", String(value))}
            name="tenantStatus"
            showClear
          />
        </RenderIf>
        <FieldsSelectLabel
          placeholder={t("tenant.filter.gender")}
          labelSelect={t("tenant.response.gender")}
          data={GENDER_OPTIONS(t)}
          value={gender}
          onChange={(value) => handleChange("gender", String(value))}
          name="gender"
          showClear
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder={t("tenant.filter.search")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default TenantFilter;
