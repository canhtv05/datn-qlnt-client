import { Dispatch, SetStateAction, useEffect } from "react";
import { useProvinces, useDistricts, useWards } from "@/hooks/useAddress";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";

interface AddressFormProps {
  provinceCode: string;
  setProvinceCode: Dispatch<SetStateAction<string>>;
  districtCode: string;
  setDistrictCode: Dispatch<SetStateAction<string>>;
  wardCode: string;
  setWardCode: Dispatch<SetStateAction<string>>;
  onLocationChange?: (provinceName: string, districtName: string, wardName: string) => void;
}

const AddressForm = ({
  provinceCode,
  setProvinceCode,
  districtCode,
  setDistrictCode,
  wardCode,
  setWardCode,
  onLocationChange,
}: AddressFormProps) => {
  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(Number(provinceCode));
  const { data: wards = [] } = useWards(Number(districtCode));

  useEffect(() => {
    setDistrictCode("");
    setWardCode("");
  }, [provinceCode, setDistrictCode, setWardCode]);

  useEffect(() => {
    setWardCode("");
  }, [districtCode, setWardCode]);

  useEffect(() => {
    const provinceName = provinces.find((p: { code: number }) => p.code === Number(provinceCode))?.name || "";
    const districtName = districts.find((d) => d.code === Number(districtCode))?.name || "";
    const wardName = wards.find((w) => w.code === Number(wardCode))?.name || "";

    if (onLocationChange) {
      onLocationChange(provinceName, districtName, wardName);
    }
  }, [provinceCode, districtCode, wardCode, provinces, districts, wards, onLocationChange]);

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <FieldsSelectLabel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={provinces.map((p: { name: any; code: any }) => ({ label: p.name, value: p.code }))}
        placeholder="Chọn tỉnh/thành"
        label="Tỉnh/Thành phố"
        id="province"
        value={provinceCode}
        onChange={setProvinceCode}
        labelSelect="Tỉnh/Thành"
        required
        showClear
      />
      <FieldsSelectLabel
        data={districts.map((d) => ({ label: d.name, value: d.code }))}
        placeholder="Chọn quận/huyện"
        label="Quận/Huyện"
        id="district"
        value={districtCode}
        onChange={setDistrictCode}
        labelSelect="Quận/Huyện"
        resetValue={!provinceCode}
        required
        showClear
      />
      <FieldsSelectLabel
        data={wards.map((w) => ({ label: w.name, value: w.code }))}
        placeholder="Chọn xã/phường"
        label="Xã/Phường"
        id="ward"
        value={wardCode}
        onChange={setWardCode}
        labelSelect="Xã/Phường"
        resetValue={!districtCode}
        required
        showClear
      />
    </div>
  );
};

export default AddressForm;
