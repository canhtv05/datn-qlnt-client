import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ApiResponse, MeterFindAllResponse, MeterReadingCreationRequest, MeterReadingUpdateRequest } from "@/types";
import { ChangeEvent, Dispatch, useCallback, useMemo } from "react";

interface AddMeterReadingProps {
  value: MeterReadingCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<MeterReadingCreationRequest>>;
  errors: Partial<Record<keyof MeterReadingCreationRequest, string>>;
  meterInitReading: ApiResponse<MeterFindAllResponse> | undefined;
  type: "add";
}

interface UpdateMeterReadingProps {
  value: MeterReadingUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<MeterReadingUpdateRequest>>;
  errors: Partial<Record<keyof MeterReadingUpdateRequest, string>>;
  meterInitReading: ApiResponse<MeterFindAllResponse> | undefined;
  type: "update";
}

type AddOrUpdateMeterReadingProps = AddMeterReadingProps | UpdateMeterReadingProps;

const AddOrUpdateMeterReading = ({
  value,
  handleChange,
  meterInitReading,
  setValue,
  errors,
  type,
}: AddOrUpdateMeterReadingProps) => {
  const meterOptions = useMemo((): FieldsSelectLabelType[] => {
    return (
      meterInitReading?.data?.map((meter) => {
        return {
          label: meter.name,
          value: meter.id,
        };
      }) ?? []
    );
  }, [meterInitReading?.data]);

  const handleChangeMeterReading = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      if (type === "update" && name === "oldIndex") return;
      handleChange(e);
    },
    [handleChange, type]
  );

  return (
    <div className="flex flex-col gap-3">
      {type === "add" && (
        <FieldsSelectLabel
          data={meterOptions}
          placeholder="-- Chọn công tơ --"
          label="Công tơ:"
          id="meterId"
          name="meterId"
          value={value.meterId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, meterId: val as string }))}
          labelSelect="Công tơ"
          showClear
          errorText={errors.meterId}
          required
        />
      )}
      <InputLabel
        id="newIndex"
        name="newIndex"
        placeholder="100"
        type="number"
        label="Chỉ số mới:"
        required
        value={value.newIndex ?? ""}
        onChange={handleChangeMeterReading}
        errorText={errors.newIndex}
      />
      {type === "add" && (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
          <InputLabel
            id="month"
            name="month"
            placeholder="1"
            min={1}
            max={12}
            step={1}
            type="number"
            label="Tháng:"
            required
            value={value.month ?? ""}
            onChange={handleChangeMeterReading}
            errorText={errors.month}
          />
          <InputLabel
            id="year"
            name="year"
            placeholder={new Date().getFullYear() + ""}
            type="number"
            label="Năm:"
            required
            value={value.year ?? ""}
            onChange={handleChangeMeterReading}
            errorText={errors.year}
          />
        </div>
      )}
      <TextareaLabel
        id="descriptionMeterReading"
        name="descriptionMeterReading"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.descriptionMeterReading ?? ""}
        onChange={(e) => {
          if (type === "add") setValue((prev) => ({ ...prev, descriptionMeterReading: e.target.value }));
          else setValue((prev) => ({ ...prev, descriptionMeterReading: e.target.value }));
        }}
        errorText={errors.descriptionMeterReading}
      />
    </div>
  );
};

export default AddOrUpdateMeterReading;
