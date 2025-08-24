import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { GENDER_OPTIONS } from "@/constant";
import { ContractTenantFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface ContractTenantFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const ContractTenantFilter = ({ props }: { props: ContractTenantFilterProps }) => {
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { t } = useTranslation();
  const { gender, query } = filterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          name="gender"
          labelSelect="Giới tính"
          placeholder="-- Giới tính --"
          data={GENDER_OPTIONS(t)}
          value={gender}
          onChange={(value) => handleChange("gender", String(value))}
          showClear
        />
        <InputLabel
          id="query"
          name="query"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default ContractTenantFilter;
