import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import { ServiceRoomCreationRequest } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface CreateRoomServiceProps {
  value: ServiceRoomCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomCreationRequest>>;
  errors: Partial<Record<keyof ServiceRoomCreationRequest, string>>;
  serviceOptions: FieldsSelectLabelType[] | undefined;
  roomOptions: FieldsSelectLabelType[] | undefined;
}

const CreateRoomService = ({
  value,
  setValue,
  errors,
  roomOptions,
  serviceOptions,
}: CreateRoomServiceProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-1 grid-cols-1 gap-5 w-full mb-2">
        <FieldsSelectLabel
          placeholder={t("roomAsset.filter.roomName")}
          labelSelect={t("room.title")}
          data={roomOptions ?? []}
          value={value?.roomId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, roomId: String(val) }));
          }}
          name="roomId"
          showClear
          errorText={errors?.roomId}
          label={t("room.title")}
          required
        />
        <FieldsSelectLabel
          placeholder={t("service.filter.title")}
          labelSelect={t("service.title")}
          data={serviceOptions ?? []}
          value={value?.serviceId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, serviceId: String(val) }));
          }}
          name="serviceId"
          showClear
          errorText={errors?.serviceId}
          label={t("service.title :")}
          required
        />
      </div>
    </div>
  );
};

export default CreateRoomService;
