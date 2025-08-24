import InputLabel from "@/components/InputLabel";
import { ServiceUpdateUnitPriceRequest } from "@/types";
import { useTranslation } from "react-i18next";

interface UpdateUnitPriceForRoomDetailProps {
  value: ServiceUpdateUnitPriceRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Partial<Record<keyof ServiceUpdateUnitPriceRequest, string>>;
}

const UpdateUnitPriceForRoomDetail = ({
  value,
  errors,
  handleChange,
}: UpdateUnitPriceForRoomDetailProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full mb-2">
        <InputLabel
          id="newUnitPrice"
          name="newUnitPrice"
          placeholder="3000000"
          type="text"
          label={t("service.addOrUpdate.price")}
          required
          value={value.newUnitPrice ?? ""}
          onChange={handleChange}
          errorText={errors.newUnitPrice}
        />
      </div>
    </div>
  );
};

export default UpdateUnitPriceForRoomDetail;
