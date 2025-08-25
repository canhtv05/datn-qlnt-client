import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { VehicleStatus, VehicleType } from "@/enums";
import { cn } from "@/lib/utils";
import TenantResponse, { ApiResponse, ICreateVehicle, IUpdateVehicle } from "@/types";
import { Dispatch, useMemo } from "react";
import { useTranslation } from "react-i18next";

type AddVehicleProps = {
  type: "add";
  value: ICreateVehicle;
  setValue: Dispatch<React.SetStateAction<ICreateVehicle>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Partial<Record<keyof ICreateVehicle, string>>;
  tenants?: ApiResponse<TenantResponse[]>;
};

type UpdateVehicleProps = {
  type: "update";
  value: IUpdateVehicle;
  setValue: Dispatch<React.SetStateAction<IUpdateVehicle>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Partial<Record<keyof IUpdateVehicle, string>>;
  tenants?: ApiResponse<TenantResponse[]>;
};

type AddOrUpdateVehicleProps = AddVehicleProps | UpdateVehicleProps;

const AddOrUpdateVehicle = (props: AddOrUpdateVehicleProps) => {
  const { t } = useTranslation();
  const vehicleType: FieldsSelectLabelType[] = [
    { label: t("statusBadge.vehicleType.motorbike"), value: VehicleType.XE_MAY },
    { label: t("statusBadge.vehicleType.car"), value: VehicleType.O_TO },
    { label: t("statusBadge.vehicleType.bicycle"), value: VehicleType.XE_DAP },
    { label: t("statusBadge.vehicleType.other"), value: VehicleType.KHAC },
  ];

  const vehicleStatus: FieldsSelectLabelType[] = [
    {
      label: t("statusBadge.vehicleStatus.active"),
      value: VehicleStatus.SU_DUNG,
    },
    {
      label: t("statusBadge.vehicleStatus.locked"),
      value: VehicleStatus.TAM_KHOA,
    },
  ];
  const { handleChange, tenants, type, value, errors, setValue } = props;

  const tenantOptions = useMemo(() => {
    return (
      tenants?.data?.map((tenant) => {
        const activeContract = tenant.contracts
          ?.filter((c) => c.status === "HIEU_LUC")
          ?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

        const room = activeContract?.roomCode || "N/A";

        return {
          label: `${tenant.fullName} - ${room}`,
          value: tenant.id,
        };
      }) || []
    );
  }, [tenants?.data]);

  return (
    <div className="flex flex-col gap-3">
      {type === "add" && (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          <FieldsSelectLabel
            data={tenantOptions}
            placeholder={t("vehicle.placeholder.owner")}
            label={t("vehicle.addOrUpdate.owner")}
            id="tenantId"
            name="tenantId"
            value={value.tenantId ?? ""}
            onChange={(val) => setValue((prev) => ({ ...prev, tenantId: val as string }))}
            labelSelect="Chủ xe"
            showClear
            errorText={errors.tenantId}
            required
          />
          <FieldsSelectLabel
            data={vehicleType}
            placeholder={t("vehicle.placeholder.type")}
            label={t("vehicle.addOrUpdate.vehicleType")}
            id="vehicleType"
            name="vehicleType"
            value={value.vehicleType ?? ""}
            onChange={(val) => setValue((prev) => ({ ...prev, vehicleType: val as VehicleType }))}
            labelSelect={t("vehicle.addOrUpdate.vehicleType")}
            showClear
            errorText={errors.vehicleType}
            required
          />
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-5",
          type === "update" && "md:grid-cols-1",
          type === "add" && "md:grid-cols-2"
        )}
      >
        {type === "update" && (
          <FieldsSelectLabel
            data={vehicleStatus}
            placeholder={t("vehicle.placeholder.status")}
            label={t("vehicle.addOrUpdate.vehicleStatus")}
            id="vehicleStatus"
            name="vehicleStatus"
            value={value.vehicleStatus ?? ""}
            onChange={(val) => {
              props.setValue((prev: IUpdateVehicle) => ({
                ...prev,
                vehicleStatus: val as VehicleStatus,
              }));
            }}
            labelSelect={t("vehicle.addOrUpdate.vehicleStatus")}
            showClear
            errorText={errors.vehicleStatus}
            required
          />
        )}
      </div>
      {type === "add" && (
        <DatePickerLabel
          date={value?.registrationDate ? new Date(value?.registrationDate) : new Date()}
          setDate={(d) => setValue((prev) => ({ ...prev, registrationDate: d.toISOString() }))}
          label={t("vehicle.addOrUpdate.registrationDate")}
          errorText={errors?.registrationDate}
        />
      )}

      {type === "add" && (
        <InputLabel
          id="licensePlate"
          name="licensePlate"
          placeholder="30A-123.45"
          required
          label={t("vehicle.addOrUpdate.licensePlate")}
          value={value.licensePlate ?? ""}
          onChange={handleChange}
          errorText={errors.licensePlate}
          disabled={
            value.vehicleType === VehicleType.XE_DAP || value.vehicleType === VehicleType.KHAC
          }
        />
      )}

      <TextareaLabel
        id="describe"
        name="describe"
        placeholder={t("vehicle.addOrUpdate.describePlaceholder")}
        label={t("vehicle.addOrUpdate.describe")}
        value={value.describe ?? ""}
        onChange={(e) => {
          if (props.type === "add") {
            props.setValue((prev: ICreateVehicle) => ({
              ...prev,
              describe: e.target.value,
            }));
          } else {
            props.setValue((prev: IUpdateVehicle) => ({
              ...prev,
              describe: e.target.value,
            }));
          }
        }}
      />
    </div>
  );
};

export default AddOrUpdateVehicle;
