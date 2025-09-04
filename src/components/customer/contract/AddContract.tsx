import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { useFormErrors } from "@/hooks";
import "ckeditor5/ckeditor5.css";

import { ICreateContract, Option } from "@/types";
import { ChangeEvent, useCallback, useState } from "react";
import Editor from "@/components/Editor";
import DescriptionValueForContract from "./DescriptionValueForContract";
import { Button } from "@/components/ui/button";
import { contract_template } from "./contract_example";
import { useContractMutation, useRoomOptions, useTenantOptions, useVehicleOptions } from "@/services/contract";
import { createContractSchema } from "@/lib/validation";
import { Switch } from "@/components/ui/switch";
import DateRangePicker from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { format, parse } from "date-fns";
import { useTranslation } from "react-i18next";

const AddContract = () => {
  const { t } = useTranslation();
  const { addAndUpdateContentContractMutation } = useContractMutation();
  const roomOptions = useRoomOptions();
  const tenantOptions = useTenantOptions();
  const vehicleOptions = useVehicleOptions();

  const [value, setValue] = useState<ICreateContract>({
    roomId: "",
    startDate: "",
    endDate: "",
    deposit: 0,
    tenants: [],
    vehicles: [],
    content: contract_template,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateContract>();

  const handleChange = useCallback(<K extends keyof ICreateContract>(field: K, newValue: ICreateContract[K]) => {
    setValue((prev) => ({ ...prev, [field]: newValue }));
  }, []);

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, key: "deposit") => {
    const parsed = Number(e.target.value.trim());
    handleChange(key, isNaN(parsed) ? 0 : parsed);
  };

  const toSelectType = (options: Option[]): FieldsSelectLabelType[] =>
    options.map((o) => ({ label: o.label, value: o.value }));

  const handleAddContract = useCallback(async () => {
    try {
      const { content, deposit, endDate, roomId, startDate, tenants, vehicles } = value;
      const data: ICreateContract = {
        content: content.trim(),
        deposit: deposit || 0,
        endDate,
        roomId,
        startDate,
        tenants,
        vehicles,
      };

      await createContractSchema.parseAsync(data);
      await addAndUpdateContentContractMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addAndUpdateContentContractMutation, clearErrors, handleZodErrors, value]);

  const dateRange = useCallback((): DateRange | undefined => {
    return value.startDate || value.endDate
      ? {
          from: value.startDate ? parse(value.startDate, "yyyy-MM-dd", new Date()) : undefined,
          to: value.endDate ? parse(value.endDate, "yyyy-MM-dd", new Date()) : undefined,
        }
      : undefined;
  }, [value.startDate, value.endDate]);

  const handleChangeDate = (range: DateRange | undefined) => {
    setValue((prev) => ({
      ...prev,
      startDate: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      endDate: range?.to ? format(range.to, "yyyy-MM-dd") : "",
    }));
  };

  return (
    <div className="bg-background p-5 rounded-md">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t("contract.addOrUpdate.titleAdd")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldsSelectLabel
              data={roomOptions}
              placeholder={t("contract.filter.placeholderRoom")}
              label={t("contract.addOrUpdate.room")}
              id="roomId"
              name="roomId"
              value={value.roomId ?? ""}
              onChange={(val) => handleChange("roomId", val as string)}
              labelSelect={t("contract.addOrUpdate.room")}
              showClear
              errorText={errors.roomId}
              required
            />
            <InputLabel
              id="deposit"
              name="deposit"
              placeholder="1000000"
              type="number"
              label={t("contract.addOrUpdate.deposit")}
              required
              value={value.deposit.toString()}
              onChange={(e) => handleNumberChange(e, "deposit")}
              errorText={errors.deposit}
            />
          </div>
          <DateRangePicker
            label={t("contract.addOrUpdate.dateRange")}
            required
            value={dateRange()}
            onChange={handleChangeDate}
            fromYear={new Date().getFullYear()}
            errorText={errors.startDate || errors.endDate}
            toYear={new Date().getFullYear() + 10}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldsMultiSelectLabel
              data={toSelectType(tenantOptions)}
              placeholder={t("contract.filter.placeholderTenant")}
              label={t("contract.addOrUpdate.tenants")}
              id="tenants"
              name="tenants"
              value={toSelectType(tenantOptions).filter((opt) =>
                value.tenants.some((t) => t.tenantId === String(opt.value))
              )}
              onChange={(selected) =>
                handleChange(
                  "tenants",
                  selected.map((item) => ({
                    tenantId: String(item.value),
                    representative: false,
                  }))
                )
              }
              required
              errorText={errors.tenants}
              renderValue={(option) => {
                const tenant = value.tenants.find((t) => t.tenantId === option.value);
                return (
                  <>
                    <span>{`${option.label} - Đại diện`}</span>
                    <Switch
                      className="cursor-pointer"
                      checked={tenant?.representative ?? false}
                      onCheckedChange={(checked) => {
                        handleChange(
                          "tenants",
                          value.tenants.map((t) =>
                            t.tenantId === option.value
                              ? { ...t, representative: checked }
                              : { ...t, representative: false }
                          )
                        );
                      }}
                    />
                  </>
                );
              }}
            />
            <FieldsMultiSelectLabel
              data={toSelectType(vehicleOptions)}
              placeholder={t("contract.filter.placeholderVehicle")}
              label={t("contract.addOrUpdate.vehicles")}
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
            <div>
              <span className="mb-1 text-label text-sm flex gap-1">
                {t("contract.addOrUpdate.content")}
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
                  {t("contract.addOrUpdate.buttonSubmit")}
                </Button>
              </Editor>
            </div>
            <DescriptionValueForContract />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddContract;
