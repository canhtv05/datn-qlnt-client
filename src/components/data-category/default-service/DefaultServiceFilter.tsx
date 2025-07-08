import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { DefaultServiceAppliesTo, DefaultServiceStatus } from "@/enums";
import { ApiResponse, DefaultServiceFilter as Filter, DefaultServiceInitResponse } from "@/types";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";

export interface DefaultServiceFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
  defaultServiceInit: ApiResponse<DefaultServiceInitResponse> | undefined;
}

const DefaultServiceFilter = ({ props }: { props: DefaultServiceFilterProps }) => {
  const {
    buildingId,
    defaultServiceAppliesTo,
    defaultServiceStatus,
    floorId,
    maxPricesApply,
    minPricesApply,
    serviceId,
  } = props.filterValues;
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
      props.defaultServiceInit?.data.buildings?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [props.defaultServiceInit?.data.buildings]);

  const floorOptions = useMemo(() => {
    const selectedBuilding = props.defaultServiceInit?.data.buildings?.find((b) => b.id === buildingId);
    return (
      selectedBuilding?.floors?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? []
    );
  }, [buildingId, props.defaultServiceInit?.data.buildings]);

  const serviceOptions = useMemo(() => {
    return (
      props.defaultServiceInit?.data?.services.map((service) => ({
        label: service.name,
        value: service.id,
      })) ?? []
    );
  }, [props.defaultServiceInit?.data?.services]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={buildingOptions}
          value={buildingId ?? ""}
          onChange={(value) => handleChange("buildingId", String(value))}
          name="buildingId"
          showClear
        />

        <FieldsSelectLabel
          placeholder="-- Tầng --"
          labelSelect="Tầng"
          data={floorOptions}
          value={floorId ?? ""}
          onChange={(value) => handleChange("floorId", String(value))}
          name="floorId"
          showClear
        />

        <FieldsSelectLabel
          placeholder="-- Dịch vụ --"
          labelSelect="Dịch vụ"
          data={serviceOptions}
          value={serviceId ?? ""}
          onChange={(value) => handleChange("serviceId", String(value))}
          name="serviceId"
          showClear
        />
      </div>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Dịch vụ áp dụng cho --"
          labelSelect="Dịch vụ áp dụng cho"
          data={[
            {
              label: "Hợp đồng",
              value: DefaultServiceAppliesTo.HOP_DONG,
            },
            {
              label: "Phòng",
              value: DefaultServiceAppliesTo.PHONG,
            },
          ]}
          value={defaultServiceAppliesTo ?? ""}
          onChange={(value) => handleChange("defaultServiceAppliesTo", String(value))}
          name="defaultServiceAppliesTo"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            {
              label: "Hoạt động",
              value: DefaultServiceStatus.HOAT_DONG,
            },
            {
              label: "Tạm dừng",
              value: DefaultServiceStatus.TAM_DUNG,
            },
          ]}
          value={defaultServiceStatus ?? ""}
          onChange={(value) => handleChange("defaultServiceStatus", String(value))}
          name="defaultServiceStatus"
          showClear
        />

        <InputLabel
          type="text"
          id="minPricesApply"
          name="minPricesApply"
          placeholder="Giá từ: 1000"
          value={minPricesApply !== undefined ? String(minPricesApply) : ""}
          onChange={(e) => handleChange("minPricesApply", e.target.value)}
        />

        <InputLabel
          type="text"
          id="maxPricesApply"
          name="maxPricesApply"
          placeholder="Tới: 2000"
          value={maxPricesApply !== undefined ? String(maxPricesApply) : ""}
          onChange={(e) => handleChange("maxPricesApply", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default DefaultServiceFilter;
