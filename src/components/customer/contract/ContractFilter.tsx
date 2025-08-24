import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { switchGrid2 } from "@/lib/utils";
import { ContractFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface ContractFilterProps {
  filterValues: ContractFilterValues;
  setFilterValues: Dispatch<SetStateAction<ContractFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const ContractFilter = ({ props, type }: { props: ContractFilterProps; type: "default" | "restore" }) => {
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
        </RenderIf>
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

export default ContractFilter;
