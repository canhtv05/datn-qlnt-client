import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { DefaultServiceAppliesTo, DefaultServiceStatus } from "@/enums";
import {
  ApiResponse,
  DefaultServiceCreationRequest,
  DefaultServiceInitResponse,
  DefaultServiceUpdateRequest,
} from "@/types";
import { Dispatch, useMemo } from "react";

type AddDefaultServiceProps = {
  type: "add";
  value: DefaultServiceCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<DefaultServiceCreationRequest>>;
  errors: Partial<Record<keyof DefaultServiceCreationRequest, string>>;
  defaultServiceInit: ApiResponse<DefaultServiceInitResponse> | undefined;
};

interface UpdateDefaultServiceProps {
  value: DefaultServiceUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<DefaultServiceUpdateRequest>>;
  errors: Partial<Record<keyof DefaultServiceUpdateRequest, string>>;
  defaultServiceInit: ApiResponse<DefaultServiceInitResponse> | undefined;
  type: "update";
}

type AddOrUpdateDefaultServiceProps = AddDefaultServiceProps | UpdateDefaultServiceProps;

const appliesTo: FieldsSelectLabelType[] = [
  {
    label: "Hợp đồng",
    value: DefaultServiceAppliesTo.HOP_DONG,
  },
  {
    label: "Phòng",
    value: DefaultServiceAppliesTo.PHONG,
  },
];

const defaultServiceStatus: FieldsSelectLabelType[] = [
  {
    label: "Hoạt động",
    value: DefaultServiceStatus.HOAT_DONG,
  },
  {
    label: "Tạm dừng",
    value: DefaultServiceStatus.TAM_DUNG,
  },
];

const AddOrUpdateDefaultService = ({
  value,
  handleChange,
  setValue,
  errors,
  type,
  defaultServiceInit,
}: AddOrUpdateDefaultServiceProps) => {
  const buildingOptions = useMemo(() => {
    if (type !== "add") return [];
    return (
      defaultServiceInit?.data.buildings?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [defaultServiceInit?.data.buildings, type]);

  const floorOptions = useMemo(() => {
    if (type !== "add") return [];
    const selectedBuilding = defaultServiceInit?.data.buildings?.find((b) => b.id === value?.buildingId);
    return (
      selectedBuilding?.floors?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? []
    );
  }, [defaultServiceInit?.data.buildings, type, value]);

  const serviceOptions = useMemo(() => {
    if (type !== "add") return [];
    return (
      defaultServiceInit?.data?.services.map((service) => ({
        label: service.name,
        value: service.id,
      })) ?? []
    );
  }, [defaultServiceInit?.data?.services, type]);

  return (
    <div className="flex flex-col gap-3">
      {type === "add" && (
        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
          <FieldsSelectLabel
            placeholder="-- Tòa nhà --"
            labelSelect="Tòa nhà"
            data={buildingOptions}
            value={value?.buildingId ?? ""}
            onChange={(value) => setValue((prev) => ({ ...prev, buildingId: value as string }))}
            name="buildingId"
            showClear
            errorText={errors.buildingId}
            label="Tòa nhà:"
            required
          />

          <FieldsSelectLabel
            placeholder="-- Tầng --"
            labelSelect="Tầng"
            data={floorOptions}
            value={value?.floorId ?? ""}
            onChange={(value) => setValue((prev) => ({ ...prev, floorId: value as string }))}
            name="floorId"
            showClear
            errorText={errors.floorId}
            label="Tầng nhà:"
            required
          />

          <FieldsSelectLabel
            placeholder="-- Dịch vụ --"
            labelSelect="Dịch vụ"
            data={serviceOptions}
            value={value?.serviceId ?? ""}
            onChange={(value) => setValue((prev) => ({ ...prev, serviceId: value as string }))}
            name="serviceId"
            showClear
            errorText={errors.serviceId}
            label="Dịch vụ:"
            required
          />
        </div>
      )}
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          data={appliesTo}
          placeholder="-- Chọn dịch vụ mặc định --"
          label="Dịch vụ mặc định:"
          id="buildingType"
          name="buildingType"
          value={value?.defaultServiceAppliesTo ?? ""}
          onChange={(val) => {
            if (type === "add") {
              setValue((prev: DefaultServiceCreationRequest) => ({
                ...prev,
                defaultServiceAppliesTo: val as DefaultServiceAppliesTo,
              }));
            } else {
              setValue((prev: DefaultServiceUpdateRequest) => ({
                ...prev,
                defaultServiceAppliesTo: val as DefaultServiceAppliesTo,
              }));
            }
          }}
          labelSelect="Áp dụng cho"
          showClear
          errorText={errors.defaultServiceAppliesTo}
          required
        />

        <FieldsSelectLabel
          data={defaultServiceStatus}
          placeholder="-- Chọn trạng thái --"
          label="Trạng thái:"
          id="defaultServiceStatus"
          name="defaultServiceStatus"
          value={value?.defaultServiceStatus ?? ""}
          onChange={(val) => {
            if (type === "add") {
              setValue((prev: DefaultServiceCreationRequest) => ({
                ...prev,
                defaultServiceStatus: val as DefaultServiceStatus,
              }));
            } else {
              setValue((prev: DefaultServiceUpdateRequest) => ({
                ...prev,
                defaultServiceStatus: val as DefaultServiceStatus,
              }));
            }
          }}
          labelSelect="Trạng thái"
          showClear
          errorText={errors.defaultServiceStatus}
          required
        />

        <InputLabel
          id="pricesApply"
          name="pricesApply"
          placeholder="3000000"
          type="text"
          label="Giá (VNĐ):"
          required
          value={value.pricesApply ?? ""}
          onChange={handleChange}
          errorText={errors.pricesApply}
        />
      </div>

      {type === "add" && (
        <DatePickerLabel
          date={value?.startApplying ? new Date(value?.startApplying) : undefined}
          setDate={(d) => setValue((prev) => ({ ...prev, startApplying: d.toISOString() }))}
          label="Ngày áp bắt đầu áp dụng:"
          errorText={errors?.startApplying}
          required
        />
      )}

      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value?.description ?? ""}
        onChange={(e) => {
          if (type === "add") setValue((prev) => ({ ...prev, description: e.target.value }));
          else setValue((prev) => ({ ...prev, description: e.target.value }));
        }}
        errorText={errors.description}
      />
    </div>
  );
};

export default AddOrUpdateDefaultService;
