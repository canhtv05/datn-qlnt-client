import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { switchGrid3 } from "@/lib/utils";
import { RevenueStatisticRequest } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface RevenueFilterProps {
  filterValues: RevenueStatisticRequest;
  setFilterValues: Dispatch<SetStateAction<RevenueStatisticRequest>>;
  onClear: () => void;
  onFilter: () => void;
  buildingOptions: FieldsSelectLabelType[] | undefined;
}

const RevenueFilter = ({ props }: { props: RevenueFilterProps }) => {
  const { buildingId, month, year } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form
      className="bg-background p-5 flex flex-col gap-3 rounded-sm mt-[2px] items-end w-full shadow-md"
      onSubmit={handleSubmit}
    >
      <div className={switchGrid3("default")}>
        <FieldsSelectLabel
          placeholder={"-- Tháng --"}
          labelSelect={"Tháng"}
          label="Tháng"
          data={[
            { label: "1", value: 1 },
            { label: "2", value: 2 },
            { label: "3", value: 3 },
            { label: "4", value: 4 },
            { label: "5", value: 5 },
            { label: "6", value: 6 },
            { label: "7", value: 7 },
            { label: "8", value: 8 },
            { label: "9", value: 9 },
            { label: "10", value: 10 },
            { label: "11", value: 11 },
            { label: "12", value: 12 },
          ]}
          value={String(month ?? new Date().getMonth() + 1)}
          onChange={(value) => {
            setFilterValues((prev) => ({ ...prev, month: Number(value) }));
          }}
          name="month"
          id="month"
        />
        <InputLabel
          id="year"
          name="number"
          placeholder={"Nhập năm"}
          label="Năm"
          value={year ?? new Date().getFullYear()}
          onChange={(value) => {
            setFilterValues((prev) => ({ ...prev, year: Number(value) }));
          }}
        />
        <FieldsSelectLabel
          label="Tòa nhà"
          placeholder={"-- Tòa nhà --"}
          labelSelect={"Tòa nhà"}
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

export default RevenueFilter;
