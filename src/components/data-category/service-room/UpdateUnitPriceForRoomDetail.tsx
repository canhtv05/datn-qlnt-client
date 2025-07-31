import InputLabel from "@/components/InputLabel";
import { ServiceUpdateUnitPriceRequest } from "@/types";

interface UpdateUnitPriceForRoomDetailProps {
  value: ServiceUpdateUnitPriceRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Partial<Record<keyof ServiceUpdateUnitPriceRequest, string>>;
}

const UpdateUnitPriceForRoomDetail = ({ value, errors, handleChange }: UpdateUnitPriceForRoomDetailProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full mb-2">
        <InputLabel
          id="newUnitPrice"
          name="newUnitPrice"
          placeholder="3000000"
          type="text"
          label="Giá (VNĐ):"
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
