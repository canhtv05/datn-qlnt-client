import DatePickerLabel from "@/components/DatePickerLabel";
import InputLabel from "@/components/InputLabel";
import { IUpdateContract } from "@/types";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  value: IUpdateContract;
  handleChange: <K extends keyof IUpdateContract>(field: K, newValue: IUpdateContract[K]) => void;
  setValue: Dispatch<SetStateAction<IUpdateContract>>;
  errors: Partial<Record<keyof IUpdateContract, string>>;
}

const UpdateContract = ({ value, setValue, handleChange, errors }: Props) => {
  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>, key: "deposit") => {
    const parsed = Number(e.target.value.trim());
    handleChange(key, isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <DatePickerLabel
          label="Ngày kết thúc:"
          date={value.endDate ? new Date(value.endDate) : undefined}
          setDate={(d) => setValue((prev) => ({ ...prev, endDate: d.toISOString() }))}
          errorText={errors.endDate}
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 10}
          required
        />
        <InputLabel
          id="deposit"
          name="deposit"
          placeholder="1000000"
          type="number"
          label="Tiền cọc:"
          required
          value={value.deposit}
          onChange={(e) => handleNumberChange(e, "deposit")}
          errorText={errors.deposit}
        />
      </div>
    </div>
  );
};

export default UpdateContract;
