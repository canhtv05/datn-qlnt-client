import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { ContractStatus } from "@/enums";
import { useFormErrors } from "@/hooks";
import "ckeditor5/ckeditor5.css";

import { ICreateAndUpdateContract, Option } from "@/types";
import { ChangeEvent, useCallback, useState } from "react";
import Editor from "@/components/Editor";
import DescriptionValueForContract from "./DescriptionValueForContract";
import { Button } from "@/components/ui/button";
import { contract_template } from "./contract_example";
import {
  useAssetOptions,
  useContractMutation,
  useRoomOptions,
  useServiceOptions,
  useTenantOptions,
  useVehicleOptions,
} from "@/services/contract";
import { createOrUpdateContractSchema } from "@/lib/validation";

const AddContract = () => {
  const { addAndUpdateContentContractMutation } = useContractMutation();
  const roomOptions = useRoomOptions();
  const tenantOptions = useTenantOptions();
  const assetOptions = useAssetOptions();
  const serviceOptions = useServiceOptions();
  const vehicleOptions = useVehicleOptions();

  const [value, setValue] = useState<ICreateAndUpdateContract>({
    roomId: "",
    numberOfPeople: 1,
    startDate: new Date(),
    endDate: new Date(),
    deposit: 0,
    tenants: [],
    assets: [],
    services: [],
    vehicles: [],
    status: ContractStatus.HIEU_LUC,
    roomPrice: 0,
    content: contract_template,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAndUpdateContract>();

  const handleChange = useCallback(
    <K extends keyof ICreateAndUpdateContract>(field: K, newValue: ICreateAndUpdateContract[K]) => {
      setValue((prev) => ({ ...prev, [field]: newValue }));
    },
    []
  );

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, key: "numberOfPeople" | "deposit") => {
    const parsed = Number(e.target.value.trim());
    handleChange(key, isNaN(parsed) ? 0 : parsed);
  };

  const toSelectType = (options: Option[]): FieldsSelectLabelType[] =>
    options.map((o) => ({ label: o.label, value: o.value }));

  const handleAddContract = useCallback(async () => {
    try {
      await createOrUpdateContractSchema.parseAsync(value);
      await addAndUpdateContentContractMutation.mutateAsync(value);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addAndUpdateContentContractMutation, clearErrors, handleZodErrors, value]);

  return (
    <div className="bg-background p-5 rounded-md">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Thêm hợp đồng</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerLabel
              label="Ngày bắt đầu:"
              date={value.startDate ? new Date(value.startDate) : undefined}
              setDate={(d) => handleChange("startDate", d)}
              errorText={errors.startDate}
              fromYear={new Date().getFullYear()}
              required
            />

            <DatePickerLabel
              label="Ngày kết thúc:"
              date={value.endDate ? new Date(value.endDate) : undefined}
              setDate={(d) => handleChange("endDate", d)}
              errorText={errors.endDate}
              fromYear={new Date().getFullYear()}
              toYear={new Date().getFullYear() + 10}
              required
            />
          </div>
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

            <FieldsMultiSelectLabel
              data={toSelectType(serviceOptions)}
              placeholder="-- Chọn dịch vụ --"
              label="Dịch vụ:"
              id="services"
              name="services"
              value={toSelectType(serviceOptions).filter((opt) => value.services.includes(String(opt.value)))}
              onChange={(selected) =>
                handleChange(
                  "services",
                  selected.map((item) => String(item.value))
                )
              }
              errorText={errors.services}
            />

            <FieldsMultiSelectLabel
              data={toSelectType(vehicleOptions)}
              placeholder="-- Chọn phương tiện --"
              label="Phương tiện:"
              id="vehicles"
              name="vehicles"
              value={toSelectType(vehicleOptions).filter((opt) => value.vehicles.includes(String(opt.value)))}
              onChange={(selected) =>
                handleChange(
                  "vehicles",
                  selected.map((item) => String(item.value))
                )
              }
              errorText={errors.vehicles}
            />
          </div>

          <div className="flex gap-10 flex-col">
            <DescriptionValueForContract />
            <div>
              <span className="mb-1 text-label text-sm flex gap-1">
                Nội dung hợp đồng
                <span className="text-[10px] text-red-500">(*)</span>
              </span>
              <Editor
                errorText={errors.content}
                isEmpty={!value.content}
                validate
                content={value.content}
                onChange={(e) =>
                  setValue((prev) => ({
                    ...prev,
                    content: e,
                  }))
                }
              >
                <Button className="mt-5 w-full text-white" onClick={() => handleAddContract()}>
                  Tạo hợp đồng
                </Button>
              </Editor>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContract;
