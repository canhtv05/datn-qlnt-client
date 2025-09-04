import {
  ApiResponse,
  AssetLittleResponse,
  ContractDetailResponse,
  ICreateContract,
  ServiceLittleResponse,
  TenantLittleResponse,
  VehicleBasicResponse,
} from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomResponse, TenantBasicResponse, AssetResponse, ServiceResponse, VehicleResponse } from "@/types";
import { Option } from "@/types";
import { handlerRequest, httpRequest } from "@/utils/httpRequest";
import { switchVehicleType } from "@/pages/customer/contract/useContract";
import { handleMutationError } from "@/utils/handleMutationError";
import { toast } from "sonner";
import { ContractStatus, Status } from "@/enums";
import {
  assetBelongToEnumToString,
  assetStatusEnumToString,
  contractStatusEnumToString,
  formattedCurrency,
  lang,
  serviceRoomStatusEnumToString,
  vehicleTypeEnumToString,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { useNavigate } from "react-router-dom";

export const useRoomOptions = (): Option[] => {
  const { data } = useQuery({
    queryKey: ["rooms-all"],
    queryFn: async () => (await httpRequest.get("/rooms/all")).data,
  });

  return (
    data?.data?.map((room: RoomResponse) => ({
      label: `${room.roomCode} - ${room.floor.buildingName}`,
      value: room.id,
    })) || []
  );
};

export const useTenantOptions = (): Option[] => {
  const { data } = useQuery({
    queryKey: ["tenants-all"],
    queryFn: async () => (await httpRequest.get("/tenants/all")).data,
  });

  return (
    data?.data?.map((tenant: TenantBasicResponse) => ({
      label: `${tenant.fullName} - ${tenant.phoneNumber}`,
      value: tenant.id,
    })) || []
  );
};

export const useAssetOptions = (): Option[] => {
  const { data } = useQuery({
    queryKey: ["assets-find-all-no-buildingId"],
    queryFn: async () => (await httpRequest.get("/assets/find-all-no-buildingId")).data,
  });

  return (
    data?.data?.map((asset: AssetResponse) => ({
      label: asset.nameAsset,
      price: asset.price,
      value: asset.id,
    })) || []
  );
};

export const useServiceOptions = (): Option[] => {
  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: async () => (await httpRequest.get("/services")).data,
  });

  return (
    data?.data?.map((service: ServiceResponse) => ({
      label: service.name,
      value: service.id,
    })) || []
  );
};

export const useVehicleOptions = (): Option[] => {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["vehicles-all"],
    queryFn: async () => (await httpRequest.get("/vehicles")).data,
  });

  return (
    data?.data?.map((v: VehicleResponse) => ({
      label: `${v.fullName} - ${switchVehicleType(v.vehicleType, t)}`,
      value: v.id,
    })) || []
  );
};

const NA = (t: TFunction<"translate", null>) => t("contract.noData");

const checkValue = (regex: RegExp, result: string, t: TFunction<"translate", null>) => {
  return result.replace(regex, NA(t));
};

// thay thế các kí tự có trong nội dung hợp đồng
export const replacePlaceholders = (
  text: string,
  values: ContractDetailResponse | undefined,
  t: TFunction<"translate", undefined>
) => {
  if (!values) {
    return;
  }
  let result = text;

  const createListHtml = (items: string[]) => {
    const ul = document.createElement("ul");
    items.forEach((html) => {
      const li = document.createElement("li");
      li.innerHTML = html;
      ul.appendChild(li);
    });
    return ul.outerHTML;
  };

  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");

    if (Array.isArray(value)) {
      if (key === "tenants") {
        if (value.length === 0) {
          result = result.replace(regex, NA(t));
          return;
        }
        if (!value) result = checkValue(regex, result, t);
        else {
          const items = (value as TenantLittleResponse[]).map(
            (te) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;"> ${t(
                "tenant.response.fullName"
              )}: ${te.fullName || NA(t)} - Email: ${te.email || NA(t)} - ${t("tenant.response.phoneNumber")}: ${
                te.phoneNumber || NA(t)
              }${te.representative ? ` - ${t("contract.representative")}` : ""}</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else if (key === "assets") {
        if (value.length === 0) {
          result = result.replace(regex, NA(t));
          return;
        }
        if (!value) result = checkValue(regex, result, t);
        else {
          const items = (value as AssetLittleResponse[]).map(
            (a) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">${t(
                "asset.response.nameAsset"
              )}: ${a.assetName || NA(t)} - ${t("asset.addOrUpdate.assetBeLongTo")} ${
                assetBelongToEnumToString(a.assetBeLongTo, t) || NA(t)
              } - ${t("asset.response.quantity")}: ${a.quantity || 0} - ${t(
                "asset.response.price"
              )}: ${formattedCurrency(a.price || 0)} - ${t("asset.response.assetStatus")}: ${
                assetStatusEnumToString(a.assetStatus, t) || NA(t)
              } - ${t("asset.response.descriptionAsset")}: ${a.description || NA(t)}</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else if (key === "services") {
        if (value.length === 0) {
          result = result.replace(regex, NA(t));
          return;
        }
        if (!value) result = checkValue(regex, result, t);
        else {
          const items = (value as ServiceLittleResponse[]).map(
            (s) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">${t(
                "service.response.name"
              )}: ${s.serviceName || NA(t)} - ${t("service.response.status")}: ${
                serviceRoomStatusEnumToString(s.serviceRoomStatus, t) || NA(t)
              } - ${t("service.response.unit")}: ${s.unit || NA(t)} - ${t("service.response.price")}: ${
                formattedCurrency(s.unitPrice) || NA(t)
              } - ${t("service.response.description")}: ${s.description || NA(t)}</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else if (key === "vehicles") {
        if (value.length === 0) {
          result = result.replace(regex, NA(t));
          return;
        }
        if (!value) result = checkValue(regex, result, t);
        else {
          const items = (value as VehicleBasicResponse[]).map(
            (v) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">${t(
                "vehicle.response.vehicleType"
              )}: ${vehicleTypeEnumToString(v.vehicleType, t) || NA(t)} - ${t("vehicle.response.licensePlate")}: ${
                v.licensePlate || NA(t)
              } - ${t("vehicle.response.describe")}: ${v.description || NA(t)}</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else {
        if (!value) result = checkValue(regex, result, t);
        else result = result.replace(regex, value.join(", "));
      }
    } else {
      if (!value) result = checkValue(regex, result, t);
      if (["createdAt", "updatedAt", "startDate", "endDate"].includes(key)) {
        if (!value) result = checkValue(regex, result, t);
        else result = result.replace(regex, new Date(value).toLocaleDateString(lang));
      } else if (key === "status") {
        if (!value) result = checkValue(regex, result, t);
        const contractStatus = value as ContractStatus;
        result = result.replace(regex, contractStatusEnumToString(contractStatus, t));
      } else if (key === "roomPrice" || key === "deposit" || key === "electricPrice" || key === "waterPrice") {
        result = result.replace(regex, formattedCurrency(value));
      } else result = result.replace(regex, String(value ?? ""));
    }
  });

  return result;
};
export const useContractMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const addAndUpdateContentContractMutation = useMutation({
    mutationFn: async (payload: ICreateContract) => {
      const res = await httpRequest.post("/contracts", payload);
      const id = res?.data?.data?.id;
      if (!id) {
        toast.error(t("contract.errorFetch"));
        return;
      }

      const [error, result] = await handlerRequest<ApiResponse<ContractDetailResponse>>(
        httpRequest.get(`/contracts/${id}`)
      );
      if (error) {
        toast.error(t("contract.errorFetch"));
        return;
      }

      const newContent = replacePlaceholders(res?.data?.data?.content, result?.data, t);
      if (!newContent) {
        toast.error(t("contract.errorFetch"));
        return;
      }

      await httpRequest.put(`/contracts/content/${id}`, newContent);

      return res.data;
    },
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));

      queryClient.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "contracts",
      });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      navigate(`/customers/contracts`, { replace: true });
    },
    onError: handleMutationError,
  });

  return { addAndUpdateContentContractMutation };
};
