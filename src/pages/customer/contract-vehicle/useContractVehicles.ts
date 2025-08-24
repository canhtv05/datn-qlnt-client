import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createContractVehicleSchema } from "@/lib/validation";
import { AddVehicleToContractRequest, ApiResponse, ContractVehicleFilter, ContractVehicleResponse } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useContractVehicles = () => {
  const { contractId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page = "1",
    size = "15",
    query = "",
    vehicleStatus = "",
    vehicleType = "",
  } = queryFilter(searchParams, "page", "size", "query", "vehicleStatus", "vehicleType");
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<ContractVehicleFilter>({
    vehicleStatus,
    vehicleType,
    query,
  });

  const handleClear = () => {
    setFilterValues({ query: "", vehicleStatus: "", vehicleType: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<AddVehicleToContractRequest>({
    contractId: contractId ?? "",
    vehicleId: "",
  });
  const { clearErrors, errors, handleZodErrors } = useFormErrors<AddVehicleToContractRequest>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ApiResponse<ContractVehicleResponse[]>>({
    queryKey: ["contract-vehicles", contractId, vehicleStatus, vehicleStatus, query],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get(`/contract-vehicles/${contractId}`);
      return res.data;
    },
    enabled: !!contractId,
    retry: 1,
  });

  const removeContractVehicleMutation = useMutation({
    mutationKey: ["remove-contract-vehicle"],
    mutationFn: async (id: string) => await httpRequest.delete(`/contract-vehicles/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string }>({
    onConfirm: async ({ id }) => {
      return await handleRemoveContractTenantById(id);
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<
    Record<string, boolean>
  >({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveContractVehicleByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các phương tiện đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleRemoveContractTenantById = async (id: string): Promise<boolean> => {
    try {
      await removeContractVehicleMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-vehicles",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
          });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (contractVehicle: ContractVehicleResponse) => {
      idRef.current = contractVehicle.id;
      openDialog(
        {
          id: contractVehicle.id,
        },
        {
          type: "warn",
          desc: Notice.REMOVE,
        }
      );
    },
    [openDialog]
  );

  const handleRemoveContractVehicleByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeContractVehicleMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-vehicles",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
      });
      toast.success(Status.REMOVE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const addContractVehicleMutation = useMutation({
    mutationKey: ["add-contract-vehicle"],
    mutationFn: async (payload: AddVehicleToContractRequest) => await httpRequest.post("/contract-vehicles", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        contractId: contractId ?? "",
        vehicleId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-vehicles",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
      });
    },
  });

  const handleAddContractVehicle = useCallback(async () => {
    try {
      const { contractId, vehicleId } = value;

      const data: AddVehicleToContractRequest = {
        contractId,
        vehicleId,
      };
      await createContractVehicleSchema.parseAsync(data);
      await addContractVehicleMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addContractVehicleMutation, clearErrors, handleZodErrors, value]);

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải hợp đồng phương tiện");
    }
  }, [isError]);

  return {
    data,
    isLoading,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    ConfirmDialog,
    handleActionClick,
    handleRemoveContractVehicleByIds,
    openDialog,
    openDialogAll,
    ConfirmDialogRemoveAll,
    handleAddContractVehicle,
    errors,
    handleChange,
    value,
    setValue,
    props: {
      filterValues,
      setFilterValues,
      onClear: handleClear,
      onFilter: handleFilter,
    },
    query: { page: parsedPage, size: parsedSize, ...filterValues },
  };
};
