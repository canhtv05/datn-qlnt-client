import DatePickerLabel from "@/components/DatePickerLabel";
import { ContractExtendAndTerminateRequest } from "@/types";
import { Dispatch } from "react";

interface ExtendOrNoticeContractProps {
  value: ContractExtendAndTerminateRequest;
  setValue: Dispatch<React.SetStateAction<ContractExtendAndTerminateRequest>>;
  errors: Partial<Record<keyof ContractExtendAndTerminateRequest, string>>;
}

const ExtendOrNoticeContract = ({ errors, setValue, value }: ExtendOrNoticeContractProps) => {
  return (
    <div className="flex flex-col gap-3 mb-3">
      <div className="grid grid-cols-1 gap-5 w-full">
        <DatePickerLabel
          date={value?.newEndDate ? new Date(value?.newEndDate) : undefined}
          setDate={(d) => {
            const date = d.toISOString();
            setValue((prev) => ({ ...prev, newEndDate: date }));
          }}
          label="Ngày hết hạn hợp đồng:"
          errorText={errors?.newEndDate}
          required
          fromYear={new Date(value.oldEndDate).getFullYear()}
          toYear={new Date(value.oldEndDate).getFullYear() + 10}
        />
      </div>
    </div>
  );
};

export default ExtendOrNoticeContract;
