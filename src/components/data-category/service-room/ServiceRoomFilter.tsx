import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { ServiceRoomStatus } from "@/enums";
import { ServiceRoomFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface ServiceRoomFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const ServiceRoomFilter = ({ props }: { props: ServiceRoomFilterProps }) => {
  const { maxPrice, minPrice, query, status } = props.filterValues;
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
      <div className="grid grid-cols-2 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Đang sử dụng", value: ServiceRoomStatus.DANG_SU_DUNG },
            { label: "Tạm dừng", value: ServiceRoomStatus.TAM_DUNG },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
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
      <div className="grid grid-cols-2 gap-5 w-full items-end">
        <InputLabel
          type="text"
          id="minPrice"
          name="minPrice"
          placeholder="Giá từ: 1000"
          value={minPrice !== undefined ? String(minPrice) : ""}
          onChange={(e) => handleChange("minPrice", e.target.value)}
        />
        <InputLabel
          type="text"
          id="maxPrice"
          name="maxPrice"
          placeholder="Tới: 2000"
          value={maxPrice !== undefined ? String(maxPrice) : ""}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default ServiceRoomFilter;
