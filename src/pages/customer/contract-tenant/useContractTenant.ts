import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createContractTenantSchema } from "@/lib/validation";
import { AddTenantToContractRequest, ApiResponse, ContractTenantDetailResponse, ContractTenantFilter } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useContractTenant = () => {
  const { contractId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page = "1",
    size = "15",
    query = "",
    gender = "",
  } = queryFilter(searchParams, "page", "size", "query", "gender");
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<ContractTenantFilter>({
    gender,
    query,
  });

  useEffect(() => {
    setFilterValues({ query, gender });
  }, [query, gender]);

  const handleClear = () => {
    setFilterValues({ query: "", gender: "" });
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
  const [value, setValue] = useState<AddTenantToContractRequest>({
    contractId: contractId ?? "",
    tenantId: "",
  });
  const { clearErrors, errors, handleZodErrors } = useFormErrors<AddTenantToContractRequest>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ApiResponse<ContractTenantDetailResponse[]>>({
    queryKey: ["contract-tenants", contractId, gender, query],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get(`/contract-tenants/${contractId}`, { params });

      return res.data;
    },
    enabled: !!contractId,
    retry: 1,
  });

  const removeContractTenantRoomMutation = useMutation({
    mutationKey: ["remove-contract-tenant"],
    mutationFn: async (id: string) => await httpRequest.delete(`/contract-tenants/${id}`),
  });

  const changeRepresentativeMutation = useMutation({
    mutationKey: ["change-representative"],
    mutationFn: async ({ id, contractId }: { id: string; contractId: string }) =>
      await httpRequest.put(`/contract-tenants/representative`, {
        contractId: contractId,
        tenantId: id,
      }),
  });

  const handleChangeRepresentativeById = async ({
    id,
    contractId,
  }: {
    id: string;
    contractId: string;
  }): Promise<boolean> => {
    try {
      await changeRepresentativeMutation.mutateAsync(
        { id, contractId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-tenants",
            });
            queryClient.invalidateQueries({
              predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
            });
            toast.success(Status.UPDATE_SUCCESS);
          },
        }
      );
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{
    id: string;
    type: "delete" | "status";
    contractId: string;
  }>({
    onConfirm: async ({ id, type, contractId }) => {
      if (type === "delete") return await handleRemoveContractTenantById(id);
      if (type === "status") return await handleChangeRepresentativeById({ id, contractId });
      return false;
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<
    Record<string, boolean>
  >({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveContractTenantByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các khách thuê đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleRemoveContractTenantById = async (id: string): Promise<boolean> => {
    try {
      await removeContractTenantRoomMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-tenants",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
          });
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (contractTenant: ContractTenantDetailResponse, action: "delete" | "status") => {
      idRef.current = contractTenant.tenantId;
      openDialog(
        {
          id: action === "status" ? contractTenant.tenantId : contractTenant.id,
          type: action,
          contractId: contractTenant.contractId,
        },
        {
          type: "warn",
          desc: action === "delete" ? Notice.REMOVE : "Bạn có muốn đổi đại diện không?",
        }
      );
    },
    [openDialog]
  );

  const handleRemoveContractTenantByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeContractTenantRoomMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-tenants",
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

  const addContractTenantMutation = useMutation({
    mutationKey: ["add-contract-tenant"],
    mutationFn: async (payload: AddTenantToContractRequest) => await httpRequest.post("/contract-tenants", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        contractId: contractId ?? "",
        tenantId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contract-tenants",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
      });
    },
  });

  const handleAddContractTenant = useCallback(async () => {
    try {
      const { contractId, tenantId } = value;

      const data: AddTenantToContractRequest = {
        contractId,
        tenantId,
      };
      await createContractTenantSchema.parseAsync(data);

      await addContractTenantMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addContractTenantMutation, clearErrors, handleZodErrors, value]);

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải hợp đồng khách thuê");
    }
  }, [isError]);

  return {
    data,
    query: { page: parsedPage, size: parsedSize, ...filterValues },
    isLoading,
    props: {
      filterValues,
      setFilterValues,
      onClear: handleClear,
      onFilter: handleFilter,
    },
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    ConfirmDialog,
    handleActionClick,
    handleRemoveContractTenantByIds,
    openDialog,
    openDialogAll,
    ConfirmDialogRemoveAll,
    handleAddContractTenant,
    errors,
    handleChange,
    value,
    setValue,
  };
};
