import { ChangeEvent } from "react";
import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { ICreateAndUpdateContract, Option } from "@/types";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { ContractStatus } from "@/enums";

const contractStatuses: FieldsSelectLabelType[] = [
  { value: ContractStatus.HIEU_LUC, label: "Hiệu lực" },
  { value: ContractStatus.SAP_HET_HAN, label: "Sắp hết hạn" },
  { value: ContractStatus.HET_HAN, label: "Hết hạn" },
  { value: ContractStatus.DA_THANH_LY, label: "Đã thanh lý" },
  { value: ContractStatus.DA_HUY, label: "Đã huỷ" },
];

interface Props {
  value: ICreateAndUpdateContract;
  handleChange: <K extends keyof ICreateAndUpdateContract>(field: K, newValue: ICreateAndUpdateContract[K]) => void;
  errors: Partial<Record<keyof ICreateAndUpdateContract, string>>;
  roomOptions: Option[];
  tenantOptions: Option[];
}

const AddOrUpdateContract = ({ value, handleChange, errors, roomOptions, tenantOptions }: Props) => {
  const roomSelectOptions: FieldsSelectLabelType[] = roomOptions.map((r) => ({
    label: r.label,
    value: r.value,
  }));

  const tenantSelectOptions: FieldsSelectLabelType[] = tenantOptions.map((t) => ({
    label: t.label,
    value: t.value,
  }));

  const handleNumberChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: "numberOfPeople" | "deposit"
  ) => {
    const parsed = Number(e.target.value.trim());
    handleChange(key, isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        <FieldsSelectLabel
          data={roomSelectOptions}
          placeholder="-- Chọn phòng --"
          label="Phòng:"
          id="roomId"
          name="roomId"
          value={value.roomId ?? ""}
          onChange={(val) => handleChange("roomId", val as string)}
          labelSelect="Phòng"
          showClear
          errorText={errors.roomId}
          required
        />
        <InputLabel
          id="numberOfPeople"
          name="numberOfPeople"
          placeholder="2"
          type="number"
          label="Số người:"
          required
          value={value.numberOfPeople.toString()}
          onChange={(e) => handleNumberChange(e, "numberOfPeople")}
          errorText={errors.numberOfPeople}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DatePickerLabel
          label="Ngày bắt đầu:"
          date={value.startDate ? new Date(value.startDate) : undefined}
          setDate={(d) => handleChange("startDate", d)}
          errorText={errors.startDate}
          required
        />
        <DatePickerLabel
          label="Ngày kết thúc:"
          date={value.endDate ? new Date(value.endDate) : undefined}
          setDate={(d) => handleChange("endDate", d)}
          errorText={errors.endDate}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputLabel
          id="deposit"
          name="deposit"
          placeholder="1000000"
          type="number"
          label="Tiền cọc:"
          required
          value={value.deposit.toString()}
          onChange={(e) => handleNumberChange(e, "deposit")}
          errorText={errors.deposit}
        />
        <FieldsSelectLabel
          data={contractStatuses}
          placeholder="-- Chọn trạng thái --"
          label="Trạng thái:"
          id="status"
          name="status"
          value={value.status ?? ""}
          onChange={(val) => handleChange("status", val as ContractStatus)}
          labelSelect="Trạng thái"
          showClear
          errorText={errors.status}
        />
      </div>

      <FieldsMultiSelectLabel
        data={tenantSelectOptions}
        placeholder="-- Chọn khách thuê --"
        label="Khách thuê:"
        id="tenants"
        name="tenants"
        value={tenantSelectOptions.filter((opt) => value.tenants.includes(String(opt.value)))}
        onChange={(selected) =>
          handleChange(
            "tenants",
            selected.map((item) => String(item.value))
          )
        }
        required
        errorText={errors.tenants}
      />
    </div>
  );
};

export default AddOrUpdateContract;
