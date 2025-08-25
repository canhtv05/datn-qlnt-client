import {
  ApiResponse,
  AssetLittleResponse,
  ContractDetailResponse,
  ICreateContract,
  ServiceBasicResponse,
  VehiclesBasicResponse,
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
  serviceCategoryEnumToString,
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
  const { data } = useQuery({
    queryKey: ["vehicles-all"],
    queryFn: async () => (await httpRequest.get("/vehicles")).data,
  });

  return (
    data?.data?.map((v: VehicleResponse) => ({
      label: `${v.fullName} - ${switchVehicleType(v.vehicleType)}`,
      value: v.id,
    })) || []
  );
};

const NA = "Không có";

const checkValue = (regex: RegExp, result: string) => {
  return result.replace(regex, NA);
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
        if (!value) result = checkValue(regex, result);
        else {
          const items = (value as TenantBasicResponse[]).map(
            (t) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Họ và tên: ${
                t.fullName || NA
              } - Email: ${t.email || NA} - SDT: ${t.phoneNumber || NA}${
                t.isRepresentative ? " - Đại diện" : ""
              }</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else if (key === "assets") {
        if (!value) result = checkValue(regex, result);
        else {
          const items = (value as AssetLittleResponse[]).map(
            (a) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Tên tài sản: ${
                a.assetName || NA
              } - Tài sản thuộc về: ${assetBelongToEnumToString(a.assetBeLongTo, t) || NA} - Số lượng: ${
                a.quantity || 0
              } - Giá: ${formattedCurrency(a.price || 0)} - Trạng thái: ${
                assetStatusEnumToString(a.assetStatus, t) || NA
              } - Mô tả: ${a.description || NA}</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else if (key === "services") {
        if (!value) result = checkValue(regex, result);
        else {
          const items = (value as ServiceBasicResponse[]).map(
            (s) =>
              `<span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Tên dịch vụ: ${
                s.name || NA
              } - Loại dịch vụ: ${serviceCategoryEnumToString(s.category, t) || NA} - Đơn vị: ${
                s.unit || NA
              } - Mô tả: ${s.description || NA}</span>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else if (key === "vehicles") {
        if (!value) result = checkValue(regex, result);
        else {
          const items = (value as VehiclesBasicResponse[]).map(
            (v) =>
              `<li><p><span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Loại phương tiện: ${
                vehicleTypeEnumToString(v.vehicleType, t) || NA
              } - Biển số: ${v.licensePlate || NA} - Mô tả: ${v.description || NA}</span></p></li>`
          );
          result = result.replace(regex, createListHtml(items));
        }
      } else {
        if (!value) result = checkValue(regex, result);
        else result = result.replace(regex, value.join(", "));
      }
    } else {
      if (!value) result = checkValue(regex, result);
      if (["createdAt", "updatedAt", "startDate", "endDate"].includes(key)) {
        if (!value) result = checkValue(regex, result);
        else result = result.replace(regex, new Date(value).toLocaleDateString("vi-VN"));
      } else if (key === "status") {
        if (!value) result = checkValue(regex, result);
        const contractStatus = value as ContractStatus;
        result = result.replace(regex, contractStatusEnumToString(contractStatus, t));
      } else if (key === "roomPrice" || key === "deposit") {
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
        toast.error("Không lấy được mã hợp đồng");
        return;
      }

      const [error, result] = await handlerRequest<ApiResponse<ContractDetailResponse>>(
        httpRequest.get(`/contracts/${id}`)
      );
      if (error) {
        toast.error("Có lỗi xảy ra khi lấy hợp đồng");
        return;
      }

      const newContent = replacePlaceholders(res?.data?.data?.content, result?.data, t);
      if (!newContent) {
        toast.error("Nội dung hợp đồng rỗng");
        return;
      }

      await httpRequest.put(`/contracts/content/${id}`, newContent);

      return res.data;
    },
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);

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
