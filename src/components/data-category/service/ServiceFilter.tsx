import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { ServiceCalculation, ServiceCategory, ServiceStatus } from "@/enums";
import { switchGrid3 } from "@/lib/utils";
import { ServiceFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface ServiceFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const ServiceFilter = ({ props, type }: { props: ServiceFilterProps; type: "default" | "restore" }) => {
  const { t } = useTranslation();
  const { maxPrice, minPrice, query, serviceStatus, serviceCalculation, serviceCategory } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid3(type)}>
        <FieldsSelectLabel
          placeholder={t("service.filter.category")}
          labelSelect={t("service.addOrUpdate.serviceCategory")}
          data={[
            { label: t("statusBadge.serviceCategory.security"), value: ServiceCategory.AN_NINH },
            { label: t("statusBadge.serviceCategory.maintenance"), value: ServiceCategory.BAO_TRI },
            { label: t("statusBadge.serviceCategory.electric"), value: ServiceCategory.DIEN },
            { label: t("statusBadge.serviceCategory.laundry"), value: ServiceCategory.GIAT_SAY },
            { label: t("statusBadge.serviceCategory.parking"), value: ServiceCategory.GUI_XE },
            { label: t("statusBadge.serviceCategory.internet"), value: ServiceCategory.INTERNET },
            { label: t("statusBadge.serviceCategory.water"), value: ServiceCategory.NUOC },
            { label: t("statusBadge.serviceCategory.elevator"), value: ServiceCategory.THANG_MAY },
            { label: t("statusBadge.serviceCategory.rent"), value: ServiceCategory.TIEN_PHONG },
            { label: t("statusBadge.serviceCategory.cleaning"), value: ServiceCategory.VE_SINH },
            { label: t("statusBadge.serviceCategory.other"), value: ServiceCategory.KHAC },
          ]}
          value={serviceCategory ?? ""}
          onChange={(value) => handleChange("serviceCategory", String(value))}
          name="serviceCategory"
          showClear
        />
        <FieldsSelectLabel
          placeholder={t("service.filter.calculation")}
          labelSelect={t("service.addOrUpdate.serviceCalculation")}
          data={[
            {
              label: t("statusBadge.serviceCalculation.byPerson"),
              value: ServiceCalculation.TINH_THEO_NGUOI,
            },
            {
              label: t("statusBadge.serviceCalculation.byRoom"),
              value: ServiceCalculation.TINH_THEO_PHONG,
            },
            {
              label: t("statusBadge.serviceCalculation.byVehicle"),
              value: ServiceCalculation.TINH_THEO_PHUONG_TIEN,
            },
            {
              label: t("statusBadge.serviceCalculation.byMeter"),
              value: ServiceCalculation.TINH_THEO_SO,
            },
          ]}
          value={serviceCalculation ?? ""}
          onChange={(value) => handleChange("serviceCalculation", String(value))}
          name="serviceCalculation"
          showClear
        />
        <RenderIf value={type === "default"}>
          <FieldsSelectLabel
            placeholder={t("service.filter.status")}
            labelSelect={t("service.addOrUpdate.status")}
            data={[
              { label: t("statusBadge.serviceStatus.active"), value: ServiceStatus.HOAT_DONG },
              { label: t("statusBadge.serviceStatus.locked"), value: ServiceStatus.TAM_KHOA },
            ]}
            value={serviceStatus ?? ""}
            onChange={(value) => handleChange("serviceStatus", String(value))}
            name="serviceStatus"
            showClear
          />
        </RenderIf>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          type="text"
          id="minPrice"
          name="minPrice"
          placeholder={t("service.filter.minPrice")}
          value={minPrice !== undefined ? String(minPrice) : ""}
          onChange={(e) => handleChange("minPrice", e.target.value)}
        />
        <InputLabel
          type="number"
          id="maxPrice"
          name="maxPrice"
          placeholder={t("service.filter.maxPrice")}
          value={maxPrice !== undefined ? String(maxPrice) : ""}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
        />
        <InputLabel
          type="number"
          id="query"
          name="query"
          placeholder={t("service.filter.search")}
          value={query ?? ""}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default ServiceFilter;
