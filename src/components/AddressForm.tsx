import { useEffect, useState } from "react";
import { useProvinces, useDistricts, useWards } from "@/hooks/useAddress";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";

export default function AddressForm() {
  const { data: provinces = [] } = useProvinces();
  const [provinceCode, setProvinceCode] = useState<string>("");
  const { data: districts = [] } = useDistricts(Number(provinceCode));
  const [districtCode, setDistrictCode] = useState<string>("");
  const { data: wards = [] } = useWards(Number(districtCode));
  const [wardCode, setWardCode] = useState<string>("");

  useEffect(() => {
    setDistrictCode("");
    setWardCode("");
  }, [provinceCode]);
  useEffect(() => {
    setWardCode("");
  }, [districtCode]);

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <FieldsSelectLabel
        data={provinces.map((p: { name: string; code: number }) => ({ label: p.name, value: p.code }))}
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
}
