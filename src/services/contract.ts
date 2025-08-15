import { ApiResponse, ContractDetailResponse, ICreateAndUpdateContract } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomResponse, TenantBasicResponse, AssetResponse, ServiceResponse, VehicleResponse } from "@/types";
import { Option } from "@/types";
import { handlerRequest, httpRequest } from "@/utils/httpRequest";
import { switchVehicleType } from "@/pages/customer/contract/useContract";
import { handleMutationError } from "@/utils/handleMutationError";
import { toast } from "sonner";
import { Status } from "@/enums";

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
export const replacePlaceholders = (text: string, values: ContractDetailResponse | undefined) => {
  if (!values) {
    console.log(JSON.stringify(values));
    return;
  }
  let result = text;

  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, "g");

    if (Array.isArray(value)) {
      if (key === "tenants") {
        if (!value) result = checkValue(regex, result);
        else {
          const listHtml = `<ul>${value
            .map(
              (t) =>
                `<li><p><span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Họ và tên: ${
                  t.fullName || "Không có"
                } - Email: ${t.email || "Không có"} - SDT: ${t.phoneNumber || "Không có"}${
                  t.isRepresentative ? " - Đại diện" : ""
                }</span></p></li>`
            )
            .join("")}</ul>`;
          result = result.replace(regex, listHtml);
        }
      } else if (key === "assets") {
        if (!value) result = checkValue(regex, result);
        else {
          const listHtml = `<ul>${value
            .map(
              (a) =>
                `<li><p><span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Tên tài sản: ${
                  a.nameAsset || "Không có"
                } - Loại tài sản: ${a.assetType || "Không có"} - Trạng thái: ${a.assetStatus || "Không có"} - Mô tả: ${
                  a.description || "Không có"
                }</span></p></li>`
            )
            .join("")}</ul>`;
          result = result.replace(regex, listHtml);
        }
      } else if (key === "services") {
        if (!value) result = checkValue(regex, result);
        else {
          const listHtml = `<ul>${value
            .map(
              (s) =>
                `<li><p><span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Tên dịch vụ: ${
                  s.name || "Không có"
                } - Loại dịch vụ: ${s.category || "Không có"} - Đơn vị: ${s.unit || "Không có"} - Mô tả: ${
                  s.description || "Không có"
                }</span></p></li>`
            )
            .join("")}</ul>`;
          result = result.replace(regex, listHtml);
        }
      } else if (key === "vehicles") {
        if (!value) result = checkValue(regex, result);
        else {
          const listHtml = `<ul>${value
            .map(
              (s) =>
                `<li><p><span style="background-color:transparent;color:#000000;font-family:'Times New Roman',serif;font-size:13.999999999999998pt;">Loại phương tiện: ${
                  s.vehicleType || "Không có"
                } - Biển số: ${s.licensePlate || "Không có"} - Mô tả: ${s.description || "Không có"}</span></p></li>`
            )
            .join("")}</ul>`;
          result = result.replace(regex, listHtml);
        }
      } else {
        if (!value) result = checkValue(regex, result);
        else result = result.replace(regex, value.join(", "));
      }
    } else {
      if (["createdAt", "updatedAt", "startDate", "endDate"].includes(key)) {
        if (!value) result = checkValue(regex, result);
        else result = result.replace(regex, new Date(value).toLocaleDateString("vi-VN"));
      }
      if (!value) result = checkValue(regex, result);
      else result = result.replace(regex, String(value ?? ""));
    }
  });

  return result;
};
export const useContractMutation = () => {
  const queryClient = useQueryClient();

  const addAndUpdateContentContractMutation = useMutation({
    mutationFn: async (payload: ICreateAndUpdateContract) => {
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

      const newContent = replacePlaceholders(res?.data?.data?.content, result?.data);
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
    },
    onError: handleMutationError,
  });

  return { addAndUpdateContentContractMutation };
};
