import { ChangeEvent } from "react";
import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { ICreateAndUpdateContract, Option } from "@/types";
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
  assetOptions: Option[];
  servicesOptions: Option[];
  vehiclesOptions: Option[];
  type: "add" | "update";
}

const AddOrUpdateContract = ({
  value,
  handleChange,
  errors,
  roomOptions,
  tenantOptions,
  assetOptions,
  servicesOptions,
  vehiclesOptions,
  type,
}: Props) => {
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, key: "numberOfPeople" | "deposit") => {
    const parsed = Number(e.target.value.trim());
    handleChange(key, isNaN(parsed) ? 0 : parsed);
  };

  const toSelectType = (options: Option[]): FieldsSelectLabelType[] =>
    options.map((o) => ({ label: o.label, value: o.value }));

  return (
    <div className="flex flex-col gap-6">
      {/* === KHỐI 1: THÔNG TIN HỢP ĐỒNG === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Thông tin hợp đồng</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldsSelectLabel
            data={roomOptions}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            toYear={2030}
          />
        </div>

        {type === "update" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        )}

        {type === "add" && (
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
        )}
        <h3 className="text-lg font-semibold">Thông tin đính kèm</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldsMultiSelectLabel
            data={toSelectType(tenantOptions)}
            placeholder="-- Chọn khách thuê --"
            label="Khách thuê:"
            id="tenants"
            name="tenants"
            value={toSelectType(tenantOptions).filter((opt) => value.tenants.includes(String(opt.value)))}
            onChange={(selected) =>
              handleChange(
                "tenants",
                selected.map((item) => String(item.value))
              )
            }
            required
            errorText={errors.tenants}
          />

          <FieldsMultiSelectLabel
            data={toSelectType(assetOptions)}
            placeholder="-- Chọn tài sản --"
            label="Tài sản:"
            id="assets"
            name="assets"
            value={toSelectType(assetOptions).filter((opt) => value.assets.includes(String(opt.value)))}
            onChange={(selected) =>
              handleChange(
                "assets",
                selected.map((item) => String(item.value))
              )
            }
            required
            errorText={errors.assets}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldsMultiSelectLabel
            data={toSelectType(servicesOptions)}
            placeholder="-- Chọn dịch vụ --"
            label="Dịch vụ:"
            id="services"
            name="services"
            value={toSelectType(servicesOptions).filter((opt) => value.services.includes(String(opt.value)))}
            onChange={(selected) =>
              handleChange(
                "services",
                selected.map((item) => String(item.value))
              )
            }
            errorText={errors.services}
          />

          <FieldsMultiSelectLabel
            data={toSelectType(vehiclesOptions)}
            placeholder="-- Chọn phương tiện --"
            label="Phương tiện:"
            id="vehicles"
            name="vehicles"
            value={toSelectType(vehiclesOptions).filter((opt) => value.vehicles.includes(String(opt.value)))}
            onChange={(selected) =>
              handleChange(
                "vehicles",
                selected.map((item) => String(item.value))
              )
            }
            errorText={errors.vehicles}
          />
        </div>
      </div>
    </div>
  );
};

export default AddOrUpdateContract;
