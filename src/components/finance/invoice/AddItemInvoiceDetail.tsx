import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { InvoiceItemType } from "@/enums";
import { ApiResponse, IdNameAndType, InvoiceDetailCreationRequest } from "@/types";
import { Dispatch, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface AddItemInvoiceDetailProps {
  value: InvoiceDetailCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceDetailCreationRequest>>;
  errors: Partial<Record<keyof InvoiceDetailCreationRequest, string>>;
  serviceRooms: ApiResponse<IdNameAndType[]> | undefined;
}

const AddItemInvoiceDetail = ({
  value,
  handleChange,
  setValue,
  errors,
  serviceRooms,
}: AddItemInvoiceDetailProps) => {
  const { t } = useTranslation();
  const DEN_BU = value.invoiceItemType === InvoiceItemType.DEN_BU;
  const DICH_VU = value.invoiceItemType === InvoiceItemType.DICH_VU;
  const DIEN_NUOC =
    value.invoiceItemType === InvoiceItemType.DIEN ||
    value.invoiceItemType === InvoiceItemType.NUOC;

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
          placeholder={t("service.response.name")}
          label={t("service.addOrUpdate.name")}
          value={value.serviceName ?? ""}
          onChange={handleChange}
          errorText={errors.serviceName}
          disabled={DICH_VU || DIEN_NUOC}
        />

        <FieldsSelectLabel
          data={[
            { label: t("statusBadge.invoiceItemType.compensation"), value: InvoiceItemType.DEN_BU },
            {
              label: t("statusBadge.invoiceItemType.service"),
              value: InvoiceItemType.DICH_VU,
            },
            { label: t("statusBadge.invoiceItemType.electric"), value: InvoiceItemType.DIEN },
            { label: t("statusBadge.invoiceItemType.water"), value: InvoiceItemType.NUOC },
          ]}
          placeholder={t("invoice.addOrUpdate.placeholderItemType")}
          label={t("invoice.addOrUpdate.labelItemType")}
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
          labelSelect={t("invoice.addOrUpdate.labelItemType")}
          showClear
          errorText={errors.invoiceItemType}
          required
        />

        <FieldsSelectLabel
          data={serviceRoomsOptions}
          placeholder={t("invoice.addOrUpdate.placeholderServiceRoom")}
          label={t("invoice.addOrUpdate.labelServiceRoom")}
          id="serviceRoomId"
          name="serviceRoomId"
          value={value.serviceRoomId ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, serviceRoomId: val as string }))}
          labelSelect={t("invoice.addOrUpdate.labelServiceRoom")}
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
          label={t("invoice.addOrUpdate.newIndex")}
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
          label={t("invoice.addOrUpdate.quantity")}
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
          label={t("invoice.addOrUpdate.unitPrice")}
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
        placeholder={t("invoice.addOrUpdate.placeholderDescription")}
        label={t("invoice.addOrUpdate.labelDescription")}
        value={value.description ?? ""}
        disabled={DICH_VU}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default AddItemInvoiceDetail;
