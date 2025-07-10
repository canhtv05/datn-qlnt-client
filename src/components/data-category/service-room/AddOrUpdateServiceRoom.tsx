import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ServiceRoomStatus } from "@/enums";
import {
  ApiResponse,
  CreateRoomServiceInitResponse,
  ServiceRoomCreationRequest,
  ServiceRoomUpdateRequest,
} from "@/types";
import { Dispatch, useMemo } from "react";

interface AddServiceRoomProps {
  value: ServiceRoomCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomCreationRequest>>;
  errors: Partial<Record<keyof ServiceRoomCreationRequest, string>>;
  serviceRoomInit?: ApiResponse<CreateRoomServiceInitResponse>;
  type: "add";
}

interface UpdateServiceRoomProps {
  value: ServiceRoomUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceRoomUpdateRequest>>;
  errors: Partial<Record<keyof ServiceRoomUpdateRequest, string>>;
  serviceRoomInit?: ApiResponse<CreateRoomServiceInitResponse>;
  type: "update";
}

type AddOrUpdateServiceRoomProps = AddServiceRoomProps | UpdateServiceRoomProps;

const AddOrUpdateServiceRoom = ({
  value,
  handleChange,
  setValue,
  errors,
  serviceRoomInit,
  type,
}: AddOrUpdateServiceRoomProps) => {
  const roomOptions = useMemo(() => {
    return (
      serviceRoomInit?.data?.rooms?.map((room) => ({
        label: room.name,
        value: room.id,
      })) ?? []
    );
  }, [serviceRoomInit]);

  const serviceOptions = useMemo(() => {
    return (
      serviceRoomInit?.data?.services?.map((room) => ({
        label: room.name,
        value: room.id,
      })) ?? []
    );
  }, [serviceRoomInit]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          placeholder="-- Phòng --"
          labelSelect="Phòng"
          data={roomOptions}
          value={value?.roomId ?? ""}
          onChange={(val) => {
            if (type === "add") {
              setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, roomId: String(val) }));
            } else {
              setValue((prev: ServiceRoomUpdateRequest) => ({ ...prev, roomId: String(val) }));
            }
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
          data={serviceOptions}
          value={value?.serviceId ?? ""}
          onChange={(val) => {
            if (type === "add") {
              setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, serviceId: String(val) }));
            } else {
              setValue((prev: ServiceRoomUpdateRequest) => ({ ...prev, serviceId: String(val) }));
            }
          }}
          name="serviceId"
          showClear
          errorText={errors?.serviceId}
          label="Dịch vụ:"
          required
        />
      </div>
      <DatePickerLabel
        date={value?.startDate ? new Date(value.startDate) : undefined}
        setDate={(d) => {
          if (type === "add") {
            setValue((prev: ServiceRoomCreationRequest) => ({ ...prev, startDate: d.toISOString() }));
          } else {
            setValue((prev: ServiceRoomUpdateRequest) => ({ ...prev, startDate: d.toISOString() }));
          }
        }}
        label="Ngày bắt đầu:"
        errorText={errors?.startDate}
        required
      />
      {type === "update" && (
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            {
              label: "Đang sử dụng",
              value: ServiceRoomStatus.DANG_SU_DUNG,
            },
            {
              label: "Tạm dừng",
              value: ServiceRoomStatus.TAM_DUNG,
            },
          ]}
          value={value?.serviceRoomStatus ?? ""}
          onChange={(val) =>
            setValue((prev: ServiceRoomUpdateRequest) => ({ ...prev, serviceRoomStatus: String(val) }))
          }
          name="serviceRoomStatus"
          showClear
          errorText={errors?.serviceRoomStatus}
          label="Trạng thái:"
          required
        />
      )}
      <InputLabel
        id="totalPrice"
        name="totalPrice"
        placeholder="3000000"
        type="text"
        label="Tổng tiền (VNĐ):"
        required
        value={value.totalPrice ?? ""}
        onChange={handleChange}
        errorText={errors.totalPrice}
      />
      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value?.descriptionServiceRoom ?? ""}
        onChange={(e) => {
          if (type === "add") setValue((prev) => ({ ...prev, descriptionServiceRoom: e.target.value }));
          else setValue((prev) => ({ ...prev, descriptionServiceRoom: e.target.value }));
        }}
        errorText={errors.descriptionServiceRoom}
      />
    </div>
  );
};

export default AddOrUpdateServiceRoom;
