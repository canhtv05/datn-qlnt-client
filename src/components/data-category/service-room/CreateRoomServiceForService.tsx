import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { Option, ServiceRoomCreationForServiceRequest } from "@/types";
import { Dispatch, useCallback } from "react";

interface CreateRoomServiceForServiceProps {
  value: ServiceRoomCreationForServiceRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomCreationForServiceRequest>>;
  errors: Partial<Record<keyof ServiceRoomCreationForServiceRequest, string>>;
  serviceOptions: Option[] | undefined;
  roomOptions: Option[] | undefined;
}

const CreateRoomServiceForService = ({
  value,
  setValue,
  errors,
  roomOptions,
  serviceOptions,
}: CreateRoomServiceForServiceProps) => {
  const handleChange = useCallback(
    <K extends keyof ServiceRoomCreationForServiceRequest>(
      field: K,
      newValue: ServiceRoomCreationForServiceRequest[K]
    ) => {
      setValue((prev) => ({ ...prev, [field]: newValue }));
    },
    [setValue]
  );

  const toSelectType = (options: Option[]): FieldsSelectLabelType[] =>
    options.map((o) => ({ label: o.label, value: o.value }));

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full mb-10">
        <FieldsMultiSelectLabel
          data={toSelectType(roomOptions ?? [])}
          placeholder="-- Chọn phòng --"
          label="Phòng:"
          id="roomIds"
          name="roomIds"
          value={toSelectType(roomOptions ?? []).filter((opt) => value.roomIds.includes(String(opt.value)))}
          onChange={(selected) =>
            handleChange(
              "roomIds",
              selected.map((item) => String(item.value))
            )
          }
          required
          errorText={errors.roomIds}
        />
        <FieldsSelectLabel
          placeholder="-- Dịch vụ --"
          labelSelect="Dịch vụ"
          data={serviceOptions ?? []}
          value={value?.serviceId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationForServiceRequest) => ({ ...prev, serviceId: String(val) }));
          }}
          name="serviceId"
          showClear
          errorText={errors?.serviceId}
          label="Dịch vụ:"
          required
        />
      </div>
    </div>
  );
};

export default CreateRoomServiceForService;
