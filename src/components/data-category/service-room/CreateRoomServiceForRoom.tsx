import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import FieldsMultiSelectLabel from "@/components/ui/FieldsMultiSelectLabel";
import { Option, ServiceRoomCreationForRoomRequest } from "@/types";
import { Dispatch, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface CreateRoomServiceForRoomProps {
  value: ServiceRoomCreationForRoomRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomCreationForRoomRequest>>;
  errors: Partial<Record<keyof ServiceRoomCreationForRoomRequest, string>>;
  serviceOptions: Option[] | undefined;
  roomOptions: Option[] | undefined;
}

const CreateRoomServiceForRoom = ({
  value,
  setValue,
  errors,
  roomOptions,
  serviceOptions,
}: CreateRoomServiceForRoomProps) => {
  const { t } = useTranslation();
  const handleChange = useCallback(
    <K extends keyof ServiceRoomCreationForRoomRequest>(
      field: K,
      newValue: ServiceRoomCreationForRoomRequest[K]
    ) => {
      setValue((prev) => ({ ...prev, [field]: newValue }));
    },
    [setValue]
  );

  const toSelectType = (options: Option[]): FieldsSelectLabelType[] =>
    options.map((o) => ({ label: o.label, value: o.value }));

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-1 grid-cols-1 gap-5 w-full mb-10">
        <FieldsSelectLabel
          placeholder={t("roomAsset.filter.roomName")}
          labelSelect={t("room.title")}
          data={roomOptions ?? []}
          value={value?.roomId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationForRoomRequest) => ({
              ...prev,
              roomId: String(val),
            }));
          }}
          name="roomId"
          showClear
          errorText={errors?.roomId}
          label={t("room.title")}
          required
        />

        <FieldsMultiSelectLabel
          data={toSelectType(serviceOptions ?? [])}
          placeholder={t("service.filter.title")}
          label={t("service.title")}
          id="serviceIds"
          name="serviceIds"
          value={toSelectType(serviceOptions ?? []).filter((opt) =>
            value.serviceIds.includes(String(opt.value))
          )}
          onChange={(selected) =>
            handleChange(
              "serviceIds",
              selected.map((item) => String(item.value))
            )
          }
          required
          errorText={errors.serviceIds}
        />
      </div>
    </div>
  );
};

export default CreateRoomServiceForRoom;
