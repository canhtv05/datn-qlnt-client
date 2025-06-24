import { useEffect, useMemo, useState } from "react";
import { useProvinces, useDistricts, useWards } from "@/hooks/useAddress";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";

export const useFullAddress = () => {
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  const { data: provinces = [] } = useProvinces();
  const { data: districts = [] } = useDistricts(Number(provinceCode));
  const { data: wards = [] } = useWards(Number(districtCode));

  const provinceName = useMemo(
    () => provinces.find((p: { code: number }) => p.code === Number(provinceCode))?.name || "",
    [provinceCode, provinces]
  );
  const districtName = useMemo(
    () => districts.find((d) => d.code === Number(districtCode))?.name || "",
    [districtCode, districts]
  );
  const wardName = useMemo(() => wards.find((w) => w.code === Number(wardCode))?.name || "", [wardCode, wards]);

  const fullAddress = useMemo(() => {
    const parts = [wardName, districtName, provinceName].filter(Boolean);
    return parts.length ? parts.join(", ") : "";
  }, [wardName, districtName, provinceName]);

  const initFromNames = (wardName?: string, districtName?: string, provinceName?: string) => {
    const foundProvince = provinces.find((p: { name: string | undefined }) => p.name === provinceName);
    const foundDistrict = districts.find((d) => d.name === districtName);
    const foundWard = wards.find((w) => w.name === wardName);

    setProvinceCode(foundProvince?.code?.toString() ?? "");
    setDistrictCode(foundDistrict?.code?.toString() ?? "");
    setWardCode(foundWard?.code?.toString() ?? "");
  };

  useEffect(() => {
    if (provinceCode) {
      setDistrictCode("");
      setWardCode("");
    }
  }, [provinceCode]);

  useEffect(() => {
    if (districtCode) {
      setWardCode("");
    }
  }, [districtCode]);

  const Address = () => (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <FieldsSelectLabel
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={provinces.map((p: { name: any; code: any }) => ({ label: p.name, value: p.code }))}
        placeholder="Chọn tỉnh/thành"
        label="Tỉnh/Thành phố"
        id="province"
        name="province"
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
        name="district"
        value={districtCode}
        onChange={setDistrictCode}
        labelSelect="Quận/Huyện"
        resetValue={!provinceCode}
        required
        showClear
        disabled={!provinceCode}
      />
      <FieldsSelectLabel
        data={wards.map((w) => ({ label: w.name, value: w.code }))}
        placeholder="Chọn xã/phường"
        label="Xã/Phường"
        id="ward"
        name="ward"
        value={wardCode}
        onChange={setWardCode}
        labelSelect="Xã/Phường"
        resetValue={!districtCode}
        required
        showClear
        disabled={!districtCode}
      />
    </div>
  );

  return {
    Address,
    fullAddress,
    provinceName,
    districtName,
    wardName,
    provinceCode,
    districtCode,
    wardCode,
    initFromNames,
  };
};
