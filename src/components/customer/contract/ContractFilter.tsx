import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { ContractFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface ContractFilterProps {
  filterValues: ContractFilterValues;
  setFilterValues: Dispatch<SetStateAction<ContractFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const ContractFilter = ({ props }: { props: ContractFilterProps }) => {
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
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          name="status"
          labelSelect="Trạng thái hợp đồng"
          placeholder="-- Trạng thái --"
          data={[
            { label: "Hiệu lực", value: "HIEU_LUC" },
            { label: "Sắp hết hạn", value: "SAP_HET_HAN" },
            { label: "Hết hạn", value: "HET_HAN" },
            { label: "Đã thanh lý", value: "DA_THANH_LY" },
            { label: "Đã huỷ", value: "DA_HUY" },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          showClear
        />
        <InputLabel
          id="query"
          name="query"
          placeholder="Hãy nhập thông tin bạn muốn tìm"
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default ContractFilter;
