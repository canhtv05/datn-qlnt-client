import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateAssetTypeSchema } from "@/lib/validation";
import { ApiResponse, AssetTypeFilterValues, AssetTypeResponse, IUpdateAssetType, PaginatedResponse } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAssetType = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    nameAssetType = "",
    assetGroup = "",
  } = queryFilter(searchParams, "page", "size", "nameAssetType", "assetGroup");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<IUpdateAssetType>({
    assetGroup: "",
    discriptionAssetType: "",
    nameAssetType: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateAssetType>();

  useEffect(() => {
    setFilterValues({ assetGroup, nameAssetType });
  }, [assetGroup, nameAssetType]);

  const [filterValues, setFilterValues] = useState<AssetTypeFilterValues>({
    assetGroup,
    nameAssetType,
  });

  const handleClear = () => {
    setFilterValues({
      assetGroup: "",
      nameAssetType: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.assetGroup) params.set("assetGroup", filterValues.assetGroup);
    if (filterValues.nameAssetType) params.set("nameAssetType", filterValues.nameAssetType);
    params.set("page", "1");
    if (filterValues.assetGroup || filterValues.nameAssetType) {
      setSearchParams(params);
    }
  }, [filterValues.assetGroup, filterValues.nameAssetType, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<PaginatedResponse<AssetTypeResponse[]>>>({
    queryKey: ["asset-types", page, size, assetGroup, nameAssetType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (assetGroup) params["assetGroup"] = assetGroup;
      if (nameAssetType) params["nameAssetType"] = nameAssetType;

      const res = await httpRequest.get("/asset-types", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAssetTypeMutation = useMutation({
    mutationKey: ["update-asset-type"],
    mutationFn: async (payload: IUpdateAssetType) => await httpRequest.put(`/asset-types/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeAssetTypeMutation = useMutation({
    mutationKey: ["remove-asset-types"],
    mutationFn: async (id: string) => await httpRequest.delete(`/asset-types/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveAssetTypesById(id);
      return false;
    },
  });

  const handleRemoveAssetTypesById = async (id: string): Promise<boolean> => {
    try {
      await removeAssetTypeMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-types",
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

  const handleUpdateFloor = useCallback(async () => {
    try {
      const { assetGroup, discriptionAssetType, nameAssetType } = value;

      await createOrUpdateAssetTypeSchema.parseAsync(value);

      const data: IUpdateAssetType = {
        assetGroup,
        discriptionAssetType: discriptionAssetType.trim(),
        nameAssetType: nameAssetType.trim(),
      };

      updateAssetTypeMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            assetGroup: "",
            discriptionAssetType: "",
            nameAssetType: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-types",
          });
          toast.success(Status.UPDATE_SUCCESS);
          setIsModalOpen(false);
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateAssetTypeMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (assetTypes: AssetTypeResponse, action: "update") => {
      idRef.current = assetTypes.id;
      if (action === "update") {
        setValue({
          assetGroup: assetTypes.assetGroup,
          discriptionAssetType: assetTypes.discriptionAssetType,
          nameAssetType: assetTypes.nameAssetType,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: assetTypes.id, type: action },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      }
    },
    [openDialog]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  if (isError) {
    toast.error("Có lỗi xảy ra khi tải loại tài sản");
  }

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      assetGroup,
      nameAssetType,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
