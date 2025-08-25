import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ServiceCalculation, ServiceCategory, ServiceStatus } from "@/enums";
import { ServiceCreationRequest, ServiceUpdateRequest } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface AddServiceProps {
  value: ServiceCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceCreationRequest>>;
  errors: Partial<Record<keyof ServiceCreationRequest, string>>;
  type: "add";
}

interface UpdateServiceProps {
  value: ServiceUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceUpdateRequest>>;
  errors: Partial<Record<keyof ServiceUpdateRequest, string>>;
  type: "update";
}

type AddOrUpdateServiceProps = AddServiceProps | UpdateServiceProps;

const AddOrUpdateService = ({
  value,
  handleChange,
  setValue,
  errors,
  type,
}: AddOrUpdateServiceProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <InputLabel
        id="name"
        name="name"
        placeholder={t("service.addOrUpdate.placeholderName")}
        label={t("service.addOrUpdate.name")}
        required
        value={value.name ?? ""}
        onChange={handleChange}
        errorText={errors.name}
      />
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          label={t("service.addOrUpdate.serviceCategory")}
          placeholder={t("service.filter.category")}
          labelSelect={t("service.addOrUpdate.serviceCategory")}
          data={[
            { label: t("statusBadge.serviceCategory.security"), value: ServiceCategory.AN_NINH },
            { label: t("statusBadge.serviceCategory.maintenance"), value: ServiceCategory.BAO_TRI },
            { label: t("statusBadge.serviceCategory.electric"), value: ServiceCategory.DIEN },
            { label: t("statusBadge.serviceCategory.laundry"), value: ServiceCategory.GIAT_SAY },
            { label: t("statusBadge.serviceCategory.parking"), value: ServiceCategory.GUI_XE },
            { label: t("statusBadge.serviceCategory.internet"), value: ServiceCategory.INTERNET },
            { label: t("statusBadge.serviceCategory.water"), value: ServiceCategory.NUOC },
            { label: t("statusBadge.serviceCategory.elevator"), value: ServiceCategory.THANG_MAY },
            { label: t("statusBadge.serviceCategory.rent"), value: ServiceCategory.TIEN_PHONG },
            { label: t("statusBadge.serviceCategory.cleaning"), value: ServiceCategory.VE_SINH },
            { label: t("statusBadge.serviceCategory.other"), value: ServiceCategory.KHAC },
          ]}
          value={value.serviceCategory ?? ""}
          onChange={(value) => {
            if (type === "add")
              setValue((prev) => ({ ...prev, serviceCategory: value as ServiceCategory }));
            else setValue((prev) => ({ ...prev, serviceCategory: value as ServiceCategory }));
          }}
          name="serviceCategory"
          id="serviceCategory"
          required
          showClear
          errorText={errors.serviceCategory}
        />
        <FieldsSelectLabel
          label={t("service.addOrUpdate.serviceCalculation")}
          placeholder={t("service.filter.calculation")}
          labelSelect={t("service.addOrUpdate.serviceCalculation")}
          data={[
            {
              label: t("statusBadge.serviceCalculation.byPerson"),
              value: ServiceCalculation.TINH_THEO_NGUOI,
            },
            {
              label: t("statusBadge.serviceCalculation.byRoom"),
              value: ServiceCalculation.TINH_THEO_PHONG,
            },
            {
              label: t("statusBadge.serviceCalculation.byVehicle"),
              value: ServiceCalculation.TINH_THEO_PHUONG_TIEN,
            },
            {
              label: t("statusBadge.serviceCalculation.byMeter"),
              value: ServiceCalculation.TINH_THEO_SO,
            },
          ]}
          value={value.serviceCalculation ?? ""}
          onChange={(value) => {
            if (type === "add")
              setValue((prev) => ({ ...prev, serviceCalculation: value as ServiceCalculation }));
            else setValue((prev) => ({ ...prev, serviceCalculation: value as ServiceCalculation }));
          }}
          name="serviceCalculation"
          id="serviceCalculation"
          showClear
          required
          errorText={errors.serviceCalculation}
        />
      </div>

      <InputLabel
        id="price"
        name="price"
        placeholder={t("service.addOrUpdate.placeholderPrice")}
        type="text"
        label={t("service.addOrUpdate.price")}
        required
        value={value.price ?? ""}
        onChange={handleChange}
        errorText={errors.price}
      />

      {type === "update" && (
        <FieldsSelectLabel
          label={t("service.addOrUpdate.status")}
          placeholder={t("service.filter.status")}
          labelSelect={t("service.addOrUpdate.status")}
          data={[
            { label: t("statusBadge.serviceStatus.active"), value: ServiceStatus.HOAT_DONG },
            { label: t("statusBadge.serviceStatus.locked"), value: ServiceStatus.TAM_KHOA },
          ]}
          value={value.status ?? ""}
          onChange={(value) => setValue((prev) => ({ ...prev, status: value as ServiceStatus }))}
          name="status"
          id="status"
          showClear
          required
          errorText={errors.status}
        />
      )}

      <TextareaLabel
        id="description"
        name="description"
        placeholder={t("service.addOrUpdate.placeholderDescription")}
        label={t("service.addOrUpdate.description")}
        value={value.description ?? ""}
        onChange={(e) => {
          if (type === "add") setValue((prev) => ({ ...prev, description: e.target.value }));
          else setValue((prev) => ({ ...prev, description: e.target.value }));
        }}
        errorText={errors.description}
      />
    </div>
  );
};

export default AddOrUpdateService;
