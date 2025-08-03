import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { MeterType, ServiceCategory } from "@/enums";
import { ApiResponse, CreateMeterInitResponse, MeterCreationAndUpdatedRequest } from "@/types";
import { Dispatch, useMemo } from "react";

interface AddOrUpdateMeterProps {
  value: MeterCreationAndUpdatedRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<MeterCreationAndUpdatedRequest>>;
  errors: Partial<Record<keyof MeterCreationAndUpdatedRequest, string>>;
  meterInit: ApiResponse<CreateMeterInitResponse> | undefined;
}

const AddOrUpdateMeter = ({ value, handleChange, meterInit, setValue, errors }: AddOrUpdateMeterProps) => {
  const serviceOptions = useMemo((): FieldsSelectLabelType[] => {
    return (
      meterInit?.data?.services
        ?.filter((service) => service.type === ServiceCategory.DIEN || service.type === ServiceCategory.NUOC)
        ?.map((service) => {
          return {
            label: service.name,
            value: service.id,
          };
        }) ?? []
    );
  }, [meterInit?.data?.services]);

  const roomOptions = useMemo((): FieldsSelectLabelType[] => {
    return (
      meterInit?.data?.rooms?.map((room) => {
        return {
          label: room.name,
          value: room.id,
        };
      }) ?? []
    );
  }, [meterInit?.data?.rooms]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          data={serviceOptions}
          placeholder="-- Chọn dịch vụ --"
          label="Dịch vụ:"
          id="serviceId"
          name="serviceId"
          value={value.serviceId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, serviceId: val as string }))}
          labelSelect="Dịch vụ"
          showClear
          errorText={errors.serviceId}
          required
        />
        <FieldsSelectLabel
          data={roomOptions}
          placeholder="-- Chọn phòng --"
          label="Phòng:"
          id="roomId"
          name="roomId"
          value={value.roomId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, roomId: val as string }))}
          labelSelect="Phòng"
          showClear
          errorText={errors.roomId}
          required
        />
        <FieldsSelectLabel
          data={[
            { label: "Công tơ điện", value: MeterType.DIEN },
            { label: "Công tơ nước", value: MeterType.NUOC },
          ]}
          placeholder="-- Chọn loại công tơ --"
          label="Loại công tơ:"
          id="meterType"
          name="meterType"
          value={value.meterType ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, meterType: val as MeterType }))}
          labelSelect="Loại công tơ"
          showClear
          errorText={errors.meterType}
          required
        />
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="meterName"
          name="meterName"
          placeholder="Công tơ A"
          type="text"
          label="Tên công tơ:"
          required
          value={value.meterName ?? ""}
          onChange={handleChange}
          errorText={errors.meterName}
        />
        <InputLabel
          id="meterCode"
          name="meterCode"
          placeholder="CT-A"
          type="text"
          label="Mã công tơ:"
          required
          value={value.meterCode ?? ""}
          onChange={handleChange}
          errorText={errors.meterCode}
        />
        <DatePickerLabel
          date={value?.manufactureDate ? new Date(value?.manufactureDate) : undefined}
          setDate={(d) => setValue((prev) => ({ ...prev, manufactureDate: d.toISOString() }))}
          label="Ngày sản xuất:"
          errorText={errors?.manufactureDate}
          required
        />
      </div>
      <InputLabel
        id="closestIndex"
        name="closestIndex"
        placeholder="0"
        type="number"
        label="Chỉ số gần nhất:"
        required
        min={0}
        value={value.closestIndex ?? ""}
        onChange={handleChange}
        errorText={errors.closestIndex}
      />

      <TextareaLabel
        id="descriptionMeter"
        name="descriptionMeter"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.descriptionMeter ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, descriptionMeter: e.target.value }))}
        errorText={errors.descriptionMeter}
      />
    </div>
  );
};

export default AddOrUpdateMeter;
