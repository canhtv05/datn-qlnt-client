import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { DepositStatus } from "@/enums";
import { DepositFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface DepositFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const DepositFilter = ({ props }: { props: DepositFilterProps }) => {
  const { query, depositStatus } = props.filterValues;
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
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Trạng thái cọc --"
          labelSelect="Trạng thái cọc"
          data={[
            { label: "Chờ xác nhận", value: DepositStatus.CHO_XAC_NHAN },
            { label: "Chưa nhận cọc", value: DepositStatus.CHUA_NHAN_COC },
            { label: "Đã đặt cọc", value: DepositStatus.DA_DAT_COC },
            { label: "Đã hoàn trả", value: DepositStatus.DA_HOAN_TRA },
            { label: "Không trả cọc", value: DepositStatus.KHONG_TRA_COC },
          ]}
          value={depositStatus}
          onChange={(value) => handleChange("depositStatus", String(value))}
          name="depositStatus"
          id="depositStatus"
          showClear
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder="Tìm kiếm"
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default DepositFilter;
