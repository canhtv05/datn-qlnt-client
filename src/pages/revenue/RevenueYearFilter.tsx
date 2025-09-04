import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { switchGrid2 } from "@/lib/utils";
import { RevenueYearRequest } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface RevenueYearFilterProps {
  filterValues: RevenueYearRequest;
  setFilterValues: Dispatch<SetStateAction<RevenueYearRequest>>;
  onClear: () => void;
  onFilter: () => void;
  buildingOptions: FieldsSelectLabelType[] | undefined;
}

const RevenueYearFilter = ({ props }: { props: RevenueYearFilterProps }) => {
  const { buildingId, year } = props.filterValues;
  const setFilterValues = props.setFilterValues;
  const { t } = useTranslation();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form
      className="bg-background p-5 flex flex-col gap-3 rounded-sm mt-[2px] items-end w-full shadow-md"
      onSubmit={handleSubmit}
    >
      <div className={switchGrid2("default")}>
        <InputLabel
          id="year"
          name="year"
          type="number"
          placeholder={t("revenue.filter.yearPlaceholder")}
          label={t("revenue.filter.year")}
          value={year ?? new Date().getFullYear()}
          onChange={(value) => {
            setFilterValues((prev) => ({ ...prev, year: Number(value.target.value) }));
          }}
        />
        <FieldsSelectLabel
          label={t("revenue.filter.building")}
          placeholder={t("revenue.filter.buildingPlaceholder")}
          labelSelect={t("revenue.filter.building")}
          data={props.buildingOptions ?? []}
          value={buildingId}
          onChange={(value) => {
            setFilterValues((prev) => ({ ...prev, buildingId: value.toString() }));
          }}
          name="buildingId"
          id="buildingId"
          showClear
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default RevenueYearFilter;
