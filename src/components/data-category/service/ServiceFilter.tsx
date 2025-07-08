import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { ServiceAppliedBy, ServiceStatus, ServiceType } from "@/enums";
import { ServiceFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface ServiceFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const ServiceFilter = ({ props }: { props: ServiceFilterProps }) => {
  const { maxPrice, minPrice, query, serviceAppliedBy, serviceStatus, serviceType } = props.filterValues;
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
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Loại dịch vụ --"
          labelSelect="Loại dịch vụ"
          data={[
            { label: "Cố định", value: ServiceType.CO_DINH },
            { label: "Tính theo số", value: ServiceType.TINH_THEO_SO },
          ]}
          value={serviceType ?? ""}
          onChange={(value) => handleChange("serviceType", String(value))}
          name="serviceType"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Dịch vụ áp dụng cho --"
          labelSelect="Dịch vụ áp dụng cho"
          data={[
            { label: "Tầng", value: ServiceAppliedBy.TANG },
            { label: "Phòng", value: ServiceAppliedBy.PHONG },
            { label: "Cố định", value: ServiceAppliedBy.NGUOI },
          ]}
          value={serviceAppliedBy ?? ""}
          onChange={(value) => handleChange("serviceAppliedBy", String(value))}
          name="serviceAppliedBy"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Hoạt động", value: ServiceStatus.HOAT_DONG },
            { label: "Tạm khóa", value: ServiceStatus.TAM_KHOA },
          ]}
          value={serviceStatus ?? ""}
          onChange={(value) => handleChange("serviceStatus", String(value))}
          name="serviceStatus"
          showClear
        />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
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
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder="Tìm kiếm"
          value={query ?? ""}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default ServiceFilter;
