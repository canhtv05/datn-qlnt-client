import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { InvoiceStatus, InvoiceType } from "@/enums";
import { ApiResponse, BuildingSelectResponse, InvoiceFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";

export interface InvoiceFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
  buildingFilter: ApiResponse<BuildingSelectResponse[]> | undefined;
}

const InvoiceFilter = ({ props }: { props: InvoiceFilterProps }) => {
  const { building, floor, invoiceStatus, invoiceType, maxTotalAmount, minTotalAmount, month, query, year } =
    props.filterValues;
  const buildingFilter = props.buildingFilter;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  const buildingOptions = useMemo(() => {
    return (
      buildingFilter?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [buildingFilter?.data]);

  const floorOptions = useMemo(() => {
    const selectedBuilding = buildingFilter?.data?.find((b) => b.id === building);
    return (
      selectedBuilding?.floors?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? []
    );
  }, [building, buildingFilter?.data]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={buildingOptions}
          value={building ?? ""}
          onChange={(value) => handleChange("building", String(value))}
          name="building"
          showClear
        />

        <FieldsSelectLabel
          placeholder="-- Tầng --"
          labelSelect="Tầng"
          data={floorOptions}
          value={floor ?? ""}
          onChange={(value) => handleChange("floor", String(value))}
          name="floor"
          showClear
        />

        <FieldsSelectLabel
          placeholder="-- Trạng thái hóa đơn --"
          labelSelect="Trạng thái hóa đơn"
          data={[
            { label: "Chưa thanh toán", value: InvoiceStatus.CHUA_THANH_TOAN },
            { label: "Đã thanh toán", value: InvoiceStatus.DA_THANH_TOAN },
            { label: "Quá hạn", value: InvoiceStatus.QUA_HAN },
          ]}
          value={invoiceStatus ?? ""}
          onChange={(value) => handleChange("invoiceStatus", String(value))}
          name="invoiceStatus"
          showClear
        />

        <FieldsSelectLabel
          placeholder="-- Loại hóa đơn --"
          labelSelect="Loại hóa đơn"
          data={[
            { label: "Hàng tháng", value: InvoiceType.HANG_THANG },
            { label: "Cuối cùng", value: InvoiceType.CUOI_CUNG },
          ]}
          value={invoiceType ?? ""}
          onChange={(value) => handleChange("invoiceType", String(value))}
          name="invoiceType"
          showClear
        />
      </div>
      <div className="grid md:grid-cols-5 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          type="number"
          id="month"
          name="month"
          placeholder="Tháng"
          min={1}
          max={12}
          step={1}
          value={month ?? undefined}
          onChange={(e) => handleChange("month", e.target.value)}
        />
        <InputLabel
          type="number"
          id="year"
          name="year"
          placeholder="Năm"
          value={year ?? undefined}
          onChange={(e) => handleChange("year", e.target.value)}
        />
        <InputLabel
          type="number"
          id="minTotalAmount"
          name="minTotalAmount"
          placeholder="Giá từ: 100000"
          value={minTotalAmount}
          onChange={(e) => handleChange("minTotalAmount", e.target.value)}
        />
        <InputLabel
          type="number"
          id="maxTotalAmount"
          name="maxTotalAmount"
          placeholder="Giá đến: 200000"
          value={maxTotalAmount}
          onChange={(e) => handleChange("maxTotalAmount", e.target.value)}
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

export default InvoiceFilter;
