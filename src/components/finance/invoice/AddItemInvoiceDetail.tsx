import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { InvoiceItemType } from "@/enums";
import { ApiResponse, IdNameAndType, InvoiceDetailCreationRequest } from "@/types";
import { Dispatch, useMemo } from "react";

interface AddItemInvoiceDetailProps {
  value: InvoiceDetailCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceDetailCreationRequest>>;
  errors: Partial<Record<keyof InvoiceDetailCreationRequest, string>>;
  serviceRooms: ApiResponse<IdNameAndType[]> | undefined;
}

const AddItemInvoiceDetail = ({ value, handleChange, setValue, errors, serviceRooms }: AddItemInvoiceDetailProps) => {
  const DEN_BU = value.invoiceItemType === InvoiceItemType.DEN_BU;
  const DICH_VU = value.invoiceItemType === InvoiceItemType.DICH_VU;
  const DIEN_NUOC = value.invoiceItemType === InvoiceItemType.DIEN || value.invoiceItemType === InvoiceItemType.NUOC;

  const serviceRoomsOptions = useMemo((): FieldsSelectLabelType[] => {
    const selectType = value.invoiceItemType;

    const res =
      serviceRooms?.data
        ?.filter((s) => {
          if (selectType === InvoiceItemType.DIEN || selectType === InvoiceItemType.NUOC) {
            return s.type === selectType;
          }

          return s.type !== InvoiceItemType.NUOC && s.type !== InvoiceItemType.DIEN && selectType;
        })
        ?.map((s) => ({
          label: s.name,
          value: s.id,
        })) ?? [];

    return res;
  }, [serviceRooms?.data, value.invoiceItemType]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="serviceName"
          name="serviceName"
          placeholder="Tên dịch vụ"
          label="Tên dịch vụ:"
          value={value.serviceName ?? ""}
          onChange={handleChange}
          errorText={errors.serviceName}
          disabled={DICH_VU || DIEN_NUOC}
        />

        <FieldsSelectLabel
          data={[
            { label: "Đền bù", value: InvoiceItemType.DEN_BU },
            { label: "Dịch vụ", value: InvoiceItemType.DICH_VU },
            { label: "Điện", value: InvoiceItemType.DIEN },
            { label: "Nước", value: InvoiceItemType.NUOC },
          ]}
          placeholder="-- Chọn loại mặt hàng hóa đơn --"
          label="Loại mặt hàng hóa đơn:"
          id="invoiceItemType"
          name="invoiceItemType"
          value={value.invoiceItemType ?? ""}
          onChange={(val) =>
            setValue((prev) => ({
              ...prev,
              invoiceItemType: val as InvoiceItemType,
              serviceRoomId: "",
              newIndex: undefined,
              quantity: undefined,
              unitPrice: undefined,
            }))
          }
          labelSelect="Loại mặt hàng hóa đơn"
          showClear
          errorText={errors.invoiceItemType}
          required
        />

        <FieldsSelectLabel
          data={serviceRoomsOptions}
          placeholder="-- Chọn dịch vụ phòng --"
          label="Dịch vụ phòng:"
          id="serviceRoomId"
          name="serviceRoomId"
          value={value.serviceRoomId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, serviceRoomId: val as string }))}
          labelSelect="Dịch vụ phòng"
          showClear
          errorText={errors.serviceRoomId}
          disabled={DEN_BU}
        />
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="newIndex"
          name="newIndex"
          placeholder="100"
          type="number"
          label="Chỉ số mới:"
          required={!DEN_BU}
          value={value.newIndex ?? ""}
          onChange={handleChange}
          errorText={errors.newIndex}
          disabled={DEN_BU || DICH_VU}
        />

        <InputLabel
          id="quantity"
          name="quantity"
          placeholder="100"
          type="number"
          label="Số lượng:"
          required
          value={value.quantity ?? ""}
          onChange={handleChange}
          errorText={errors.quantity}
          disabled={DICH_VU || DIEN_NUOC}
        />

        <InputLabel
          id="unitPrice"
          name="unitPrice"
          placeholder="100"
          type="number"
          label="Đơn giá:"
          required
          value={value.unitPrice ?? ""}
          onChange={handleChange}
          errorText={errors.unitPrice}
          disabled={DICH_VU || DIEN_NUOC}
        />
      </div>
      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.description ?? ""}
        disabled={DICH_VU}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default AddItemInvoiceDetail;
