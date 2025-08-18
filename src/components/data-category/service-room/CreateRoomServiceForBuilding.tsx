import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import { ServiceRoomCreationForBuildingRequest } from "@/types";
import { Dispatch } from "react";

interface CreateRoomServiceForBuildingProps {
  value: ServiceRoomCreationForBuildingRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomCreationForBuildingRequest>>;
  errors: Partial<Record<keyof ServiceRoomCreationForBuildingRequest, string>>;
  serviceOptions: FieldsSelectLabelType[] | undefined;
  buildingOptions: FieldsSelectLabelType[] | undefined;
}

const CreateRoomServiceForBuilding = ({
  value,
  setValue,
  errors,
  // buildingOptions,
  serviceOptions,
}: CreateRoomServiceForBuildingProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-1 grid-cols-1 gap-5 w-full mb-2">
        {/* <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={buildingOptions ?? []}
          value={value?.buildingId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationForBuildingRequest) => ({ ...prev, buildingId: String(val) }));
          }}
          name="buildingId"
          showClear
          errorText={errors?.buildingId}
          label="Tòa nhà:"
          required
        /> */}
        <FieldsSelectLabel
          placeholder="-- Dịch vụ --"
          labelSelect="Dịch vụ"
          data={serviceOptions ?? []}
          value={value?.serviceId ?? ""}
          onChange={(val) => {
            setValue((prev: ServiceRoomCreationForBuildingRequest) => ({ ...prev, serviceId: String(val) }));
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

export default CreateRoomServiceForBuilding;
