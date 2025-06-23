import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface FilterValues {
  search: string;
  status: string;
}

export interface BuildingFilterProps {
  filterValues: FilterValues;
  setFilterValues: Dispatch<SetStateAction<FilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const BuildingFilter = ({ props }: { props: BuildingFilterProps }) => {
  const { search, status } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof FilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className=" bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="flex gap-5 items-end w-full">
        <div className="w-1/2">
          <FieldsSelectLabel
            placeholder="-- Trạng thái hoạt động --"
            labelSelect="Trạng thái"
            data={[
              { label: "Hoạt động", value: "HOAT_DONG" },
              { label: "Tạm khóa", value: "TAM_KHOA" },
            ]}
            value={status}
            onChange={(value) => handleChange("status", String(value))}
          />
        </div>
        <div className="w-1/2">
          <InputLabel
            type="text"
            id="search"
            name="search"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </div>
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default BuildingFilter;
