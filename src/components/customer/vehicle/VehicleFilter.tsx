import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { VehicleType } from "@/enums";
import { VehicleFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface VehicleFilterProps {
  filterValues: VehicleFilterValues;
  setFilterValues: Dispatch<SetStateAction<VehicleFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const VehicleFilter = ({ props }: { props: VehicleFilterProps }) => {
  const { licensePlate, vehicleType } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof VehicleFilterValues, value: string) => {
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
          placeholder="-- Loại phương tiện --"
          labelSelect="Loại phương tiện"
          data={[
            { label: "Xe máy", value: VehicleType.XE_MAY },
            { label: "Ô tô", value: VehicleType.O_TO },
            { label: "Xe đạp", value: VehicleType.XE_DAP },
            { label: "Khác", value: VehicleType.KHAC },
          ]}
          value={vehicleType}
          onChange={(value) => handleChange("vehicleType", String(value))}
          name="vehicleType"
          showClear
        />
        <InputLabel
          type="text"
          id="licensePlate"
          name="licensePlate"
          placeholder="Biển số xe"
          value={licensePlate}
          onChange={(e) => handleChange("licensePlate", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default VehicleFilter;
