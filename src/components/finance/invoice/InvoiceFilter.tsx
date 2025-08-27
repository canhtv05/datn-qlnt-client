import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { InvoiceStatus, InvoiceType } from "@/enums";
import { switchGrid4 } from "@/lib/utils";
import { ApiResponse, BuildingSelectResponse, InvoiceFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface InvoiceFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
  buildingFilter: ApiResponse<BuildingSelectResponse[]> | undefined;
}

const InvoiceFilter = ({
  props,
  type,
}: {
  props: InvoiceFilterProps;
  type: "default" | "restore";
}) => {
  const { t } = useTranslation();
  const {
    building,
    floor,
    invoiceStatus,
    invoiceType,
    maxTotalAmount,
    minTotalAmount,
    month,
    query,
    year,
  } = props.filterValues;
  const buildingFilter = props.buildingFilter;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  const buildingOptions = useMemo(() => {
    return (
      buildingFilter?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [buildingFilter?.data]);

  const floorOptions = useMemo(() => {
    const selectedBuilding = buildingFilter?.data?.find((b) => b.id === building);
    return (
      selectedBuilding?.floors?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? []
    );
  }, [building, buildingFilter?.data]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid4(type)}>
        <FieldsSelectLabel
          placeholder={t("invoice.filter.placeholderBuilding")}
          labelSelect={t("invoice.response.building")}
          data={buildingOptions}
          value={building ?? ""}
          onChange={(value) => handleChange("building", String(value))}
          name="building"
          showClear
        />

        <FieldsSelectLabel
          placeholder={t("invoice.filter.placeholderFloor")}
          labelSelect={t("invoice.response.floor")}
          data={floorOptions}
          value={floor ?? ""}
          onChange={(value) => handleChange("floor", String(value))}
          name="floor"
          showClear
        />

        <RenderIf value={type === "default"}>
          <FieldsSelectLabel
            placeholder={t("invoice.filter.placeholderType")}
            labelSelect={t("invoice.response.invoiceType")}
            data={[
              {
                label: t("statusBadge.invoiceStatus.unpaid"),
                value: InvoiceStatus.CHUA_THANH_TOAN,
              },
              { label: t("statusBadge.invoiceStatus.paid"), value: InvoiceStatus.DA_THANH_TOAN },
              { label: t("statusBadge.invoiceStatus.restored"), value: InvoiceStatus.KHOI_PHUC },
              { label: t("statusBadge.invoiceStatus.overdue"), value: InvoiceStatus.QUA_HAN },
            ]}
            value={invoiceStatus ?? ""}
            onChange={(value) => handleChange("invoiceStatus", String(value))}
            name="invoiceStatus"
            showClear
          />
        </RenderIf>

        <FieldsSelectLabel
          placeholder={t("invoice.filter.placeholderStatus")}
          labelSelect={t("invoice.response.invoiceType")}
          data={[
            { label: t("statusBadge.invoiceType.monthly"), value: InvoiceType.HANG_THANG },
            { label: t("statusBadge.invoiceType.final"), value: InvoiceType.CUOI_CUNG },
          ]}
          value={invoiceType ?? ""}
          onChange={(value) => handleChange("invoiceType", String(value))}
          name="invoiceType"
          showClear
        />
      </div>
      <div className="grid md:grid-cols-5 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          type="number"
          id="month"
          name="month"
          placeholder={t("invoice.filter.placeholderMonth")}
          min={1}
          max={12}
          step={1}
          value={month ?? undefined}
          onChange={(e) => handleChange("month", e.target.value)}
        />
        <InputLabel
          type="number"
          id="year"
          name="year"
          placeholder={t("invoice.filter.placeholderYear")}
          value={year ?? undefined}
          onChange={(e) => handleChange("year", e.target.value)}
        />
        <InputLabel
          type="number"
          id="minTotalAmount"
          name="minTotalAmount"
          placeholder={t("invoice.filter.placeholderMinTotalAmount")}
          value={minTotalAmount}
          onChange={(e) => handleChange("minTotalAmount", e.target.value)}
        />
        <InputLabel
          type="number"
          id="maxTotalAmount"
          name="maxTotalAmount"
          placeholder={t("invoice.filter.placeholderMaxTotalAmount")}
          value={maxTotalAmount}
          onChange={(e) => handleChange("maxTotalAmount", e.target.value)}
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder={t("invoice.filter.placeholderQuery")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default InvoiceFilter;
