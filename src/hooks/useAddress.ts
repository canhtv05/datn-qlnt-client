import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProvinces = () =>
  useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=1");
      return res.data;
    },
  });

export const useDistricts = (provinceCode?: number) =>
  useQuery({
    queryKey: ["districts", provinceCode],
    queryFn: async () => {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.data.districts as any[];
    },
    enabled: !!provinceCode,
  });

export const useWards = (districtCode?: number) =>
  useQuery({
    queryKey: ["wards", districtCode],
    queryFn: async () => {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return res.data.wards as any[];
    },
    enabled: !!districtCode,
  });
