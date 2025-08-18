import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import { ServiceRoomCreationRequest } from "@/types";
import { Dispatch } from "react";

interface CreateRoomServiceProps {
  value: ServiceRoomCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomCreationRequest>>;
  errors: Partial<Record<keyof ServiceRoomCreationRequest, string>>;
  serviceOptions: FieldsSelectLabelType[] | undefined;
  roomOptions: FieldsSelectLabelType[] | undefined;
}

const CreateRoomService = ({ value, setValue, errors, roomOptions, serviceOptions }: CreateRoomServiceProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-1 grid-cols-1 gap-5 w-full mb-2">
        <FieldsSelectLabel
          placeholder="-- Phòng --"
          labelSelect="Phòng"
          data={roomOptions ?? []}
          value={value?.roomId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, roomId: String(val) }));
          }}
          name="roomId"
          showClear
          errorText={errors?.roomId}
          label="Phòng:"
          required
        />
        <FieldsSelectLabel
          placeholder="-- Dịch vụ --"
          labelSelect="Dịch vụ"
          data={serviceOptions ?? []}
          value={value?.serviceId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, serviceId: String(val) }));
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

export default CreateRoomService;
