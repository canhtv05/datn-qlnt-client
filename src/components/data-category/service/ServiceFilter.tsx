import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { ServiceCalculation, ServiceCategory, ServiceStatus } from "@/enums";
import { ServiceFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface ServiceFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const ServiceFilter = ({ props }: { props: ServiceFilterProps }) => {
  const { maxPrice, minPrice, query, serviceStatus, serviceCalculation, serviceCategory } = props.filterValues;
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
            { label: "An ninh", value: ServiceCategory.AN_NINH },
            { label: "Bảo trì", value: ServiceCategory.BAO_TRI },
            { label: "Điện", value: ServiceCategory.DIEN },
            { label: "Giặt sấy", value: ServiceCategory.GIAT_SAY },
            { label: "Gửi xe", value: ServiceCategory.GUI_XE },
            { label: "Internet", value: ServiceCategory.INTERNET },
            { label: "Nước", value: ServiceCategory.NUOC },
            { label: "Thang máy", value: ServiceCategory.THANG_MAY },
            { label: "Tiền phòng", value: ServiceCategory.TIEN_PHONG },
            { label: "Vệ sinh", value: ServiceCategory.VE_SINH },
            { label: "Khác", value: ServiceCategory.KHAC },
          ]}
          value={serviceCategory ?? ""}
          onChange={(value) => handleChange("serviceCategory", String(value))}
          name="serviceCategory"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Tính toán dịch vụ --"
          labelSelect="Tính toán dịch vụ"
          data={[
            { label: "Tính theo người", value: ServiceCalculation.TINH_THEO_NGUOI },
            { label: "Tính theo phòng", value: ServiceCalculation.TINH_THEO_PHONG },
            { label: "TÍnh theo phương tiện", value: ServiceCalculation.TINH_THEO_PHUONG_TIEN },
            { label: "Tính theo số", value: ServiceCalculation.TINH_THEO_SO },
          ]}
          value={serviceCalculation ?? ""}
          onChange={(value) => handleChange("serviceCalculation", String(value))}
          name="serviceCalculation"
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
