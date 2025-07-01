import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateAssetSchema } from "@/lib/validation";
import { ApiResponse, AssetResponse, IUpdateAsset } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAsset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page = "1", size = "15", nameAsset = "" } = queryFilter(searchParams, "page", "size", "nameAsset");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<IUpdateAsset>({
    assetBeLongTo: "",
    assetTypeId: "",
    buildingID: "",
    descriptionAsset: "",
    floorID: "",
    nameAsset: "",
    price: undefined,
    roomID: "",
    tenantId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateAsset>();

  useEffect(() => {
    setFilterValues({ nameAsset });
  }, [nameAsset]);

  const [filterValues, setFilterValues] = useState<{ nameAsset: string }>({
    nameAsset,
  });

  const handleClear = () => {
    setFilterValues({
      nameAsset: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.nameAsset) params.set("nameAsset", filterValues.nameAsset);
    params.set("page", "1");
    if (filterValues.nameAsset) {
      setSearchParams(params);
    }
  }, [filterValues.nameAsset, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<AssetResponse[]>>({
    queryKey: ["assets", page, size, nameAsset],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (nameAsset) params["nameAsset"] = nameAsset;

      const res = await httpRequest.get("/assets", {
        params,
      });

      return res.data;
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAssetMutation = useMutation({
    mutationKey: ["update-assets"],
    mutationFn: async (payload: IUpdateAsset) => await httpRequest.put(`/assets/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeAssetMutation = useMutation({
    mutationKey: ["remove-assets"],
    mutationFn: async (id: string) => await httpRequest.delete(`/assets/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveAssetById(id);
      return false;
    },
  });

  const handleRemoveAssetById = async (id: string): Promise<boolean> => {
    try {
      await removeAssetMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
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
      const { assetBeLongTo, assetTypeId, buildingID, descriptionAsset, floorID, nameAsset, price, roomID, tenantId } =
        value;

      await createOrUpdateAssetSchema.parseAsync(value);

      const data: IUpdateAsset = {
        assetBeLongTo,
        assetTypeId,
        buildingID,
        descriptionAsset: descriptionAsset.trim(),
        floorID,
        nameAsset: nameAsset.trim(),
        price,
        roomID,
        tenantId,
      };

      updateAssetMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            assetBeLongTo: "",
            assetTypeId: "",
            buildingID: "",
            descriptionAsset: "",
            floorID: "",
            nameAsset: "",
            price: undefined,
            roomID: "",
            tenantId: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
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
  }, [updateAssetMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (asset: AssetResponse, action: "update") => {
      idRef.current = asset.id;
      if (action === "update") {
        setValue({
          assetBeLongTo: asset.assetBeLongTo,
          assetTypeId: asset.assetTypeId,
          buildingID: asset.buildingID,
          descriptionAsset: asset.descriptionAsset,
          floorID: asset.floorID,
          nameAsset: asset.nameAsset,
          price: asset.price,
          roomID: asset.roomID,
          tenantId: asset.tenantId,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: asset.id, type: action },
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
      nameAsset,
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
