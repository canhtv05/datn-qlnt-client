import DatePickerLabel from "@/components/DatePickerLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ChangeMeterRequest } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface ChangeMeterProps {
  value: ChangeMeterRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ChangeMeterRequest>>;
  errors: Partial<Record<keyof ChangeMeterRequest, string>>;
}

const ChangeMeter = ({ value, handleChange, errors, setValue }: ChangeMeterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="meterName"
          name="meterName"
          placeholder={t("meter.addOrUpdate.meterName")}
          type="text"
          label={t("meter.addOrUpdate.meterName")}
          required
          value={value.meterName ?? ""}
          onChange={handleChange}
          errorText={errors.meterName}
        />
        <InputLabel
          id="meterCode"
          name="meterCode"
          placeholder={t("meter.addOrUpdate.meterCode")}
          type="text"
          label={t("meter.addOrUpdate.meterCode")}
          required
          value={value.meterCode ?? ""}
          onChange={handleChange}
          errorText={errors.meterCode}
        />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="closestIndex"
          name="closestIndex"
          placeholder="0"
          type="number"
          label={t("meter.addOrUpdate.closestIndex")}
          required
          min={0}
          value={value.closestIndex ?? ""}
          onChange={handleChange}
          errorText={errors.closestIndex}
        />
        <DatePickerLabel
          date={value?.manufactureDate ? new Date(value?.manufactureDate) : undefined}
          setDate={(d) => setValue((prev) => ({ ...prev, manufactureDate: d.toISOString() }))}
          label={t("meter.addOrUpdate.manufactureDate")}
          errorText={errors?.manufactureDate}
          required
        />
      </div>
      <TextareaLabel
        id="descriptionMeter"
        name="descriptionMeter"
        placeholder={t("meter.addOrUpdate.descriptionMeterPlaceholder")}
        label={t("meter.addOrUpdate.descriptionMeter")}
        value={value.descriptionMeter ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, descriptionMeter: e.target.value }))}
        errorText={errors.descriptionMeter}
      />
    </div>
  );
};

export default ChangeMeter;
