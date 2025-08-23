import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateAssetSchema } from "@/lib/validation";
import {
  ApiResponse,
  AssetFilter,
  AssetResponse,
  AssetStatusStatistic,
  IUpdateAsset,
  PaginatedResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CircleCheck,
  CircleDollarSign,
  HelpCircle,
  Wrench,
  XCircle,
} from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAsset = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const {
    page = "1",
    size = "15",
    nameAsset = "",
    assetBeLongTo = "",
    assetStatus = "",
    assetType = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "nameAsset",
    "assetType",
    "assetBeLongTo",
    "assetStatus"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<IUpdateAsset>({
    assetBeLongTo: "",
    assetType: "",
    descriptionAsset: "",
    nameAsset: "",
    price: undefined,
    quantity: undefined,
    assetStatus: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateAsset>();

  const [filterValues, setFilterValues] = useState<AssetFilter>({
    nameAsset,
    assetBeLongTo,
    assetStatus,
    assetType,
  });

  const handleClear = () => {
    setFilterValues({
      assetType: "",
      assetBeLongTo: "",
      assetStatus: "",
      nameAsset: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.nameAsset) params.set("nameAsset", filterValues.nameAsset);
    if (filterValues.assetBeLongTo) params.set("assetBeLongTo", filterValues.assetBeLongTo);
    if (filterValues.assetStatus) params.set("assetStatus", filterValues.assetStatus);
    if (filterValues.assetType) params.set("assetType", filterValues.assetType);
    params.set("page", "1");
    if (filterValues.nameAsset || filterValues.assetStatus || filterValues.assetBeLongTo) {
      setSearchParams(params);
    }
  }, [
    filterValues.assetBeLongTo,
    filterValues.assetStatus,
    filterValues.assetType,
    filterValues.nameAsset,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<PaginatedResponse<AssetResponse[]>>>({
    queryKey: ["assets", page, size, nameAsset, assetBeLongTo, assetStatus, assetType, id],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (nameAsset) params["nameAsset"] = nameAsset;
      if (assetStatus) params["assetStatus"] = assetStatus;
      if (assetBeLongTo) params["assetBeLongTo"] = assetBeLongTo;
      if (assetType) params["assetType"] = assetType;
      if (id) params["buildingId"] = id;

      const res = await httpRequest.get("/assets", {
        params,
      });

      return res.data;
    },
    enabled: !!id,
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

  const { data: statistics, isError: isStatisticsError } = useQuery<
    ApiResponse<AssetStatusStatistic>
  >({
    queryKey: ["asset-statistics", id],
    queryFn: async () => {
      const res = await httpRequest.get("/assets/statistics", {
        params: {
          buildingId: id,
        },
      });
      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  const dataAssets: StatisticCardType[] = [
    {
      icon: CircleDollarSign,
      label: t("asset.title"),
      value: statistics?.data.totalAssets ?? 0,
    },
    {
      icon: CircleCheck,
      label: t("statusBadge.assetStatus.active"),
      value: statistics?.data.totalActiveAssets ?? 0,
    },
    {
      icon: Wrench,
      label: t("statusBadge.assetStatus.maintenance"),
      value: statistics?.data.totalMaintenanceAssets ?? 0,
    },
    {
      icon: AlertTriangle,
      label: t("statusBadge.assetStatus.broken"),
      value: statistics?.data.totalBrokenAssets ?? 0,
    },
    {
      icon: HelpCircle,
      label: t("statusBadge.assetStatus.lost"),
      value: statistics?.data.totalLostAssets ?? 0,
    },
    {
      icon: XCircle,
      label: t("statusBadge.assetStatus.inactive"),
      value: statistics?.data.totalDisabledAssets ?? 0,
    },
  ];

  const updateAssetMutation = useMutation({
    mutationKey: ["update-assets"],
    mutationFn: async (payload: IUpdateAsset) =>
      await httpRequest.put(`/assets/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeAssetMutation = useMutation({
    mutationKey: ["remove-assets"],
    mutationFn: async (id: string) => await httpRequest.put(`/assets/soft-delete/${id}`),
  });

  const toggleStatusBuildingMutation = useMutation({
    mutationKey: ["toggle-assets"],
    mutationFn: async (id: string) => await httpRequest.put(`/assets/toggle/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>(
    {
      onConfirm: async ({ id, type }) => {
        if (type === "delete") return await handleRemoveAssetById(id);
        if (type === "status") return await handleToggleStatusBuildingById(id);
        return false;
      },
    }
  );

  const handleToggleStatusBuildingById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusBuildingMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
          });
          toast.success(t(Status.UPDATE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRemoveAssetById = async (id: string): Promise<boolean> => {
    try {
      await removeAssetMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
          });
          toast.success(t(Status.REMOVE_SUCCESS));
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
      const {
        assetBeLongTo,
        assetType,
        descriptionAsset,
        nameAsset,
        price,
        quantity,
        assetStatus,
      } = value;

      const data: IUpdateAsset = {
        assetBeLongTo,
        assetType: assetType ?? "",
        descriptionAsset,
        nameAsset,
        price: price || 0,
        quantity: quantity || 0,
        assetStatus,
      };

      await updateAssetSchema.parseAsync(data);

      await updateAssetMutation.mutateAsync(data, {
        onSuccess: () => {
          setValue({
            assetBeLongTo: "",
            assetType: "",
            descriptionAsset: "",
            nameAsset: "",
            price: undefined,
            quantity: undefined,
            assetStatus: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
          });
          toast.success(t(Status.UPDATE_SUCCESS));
          setIsModalOpen(false);
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateAssetMutation, clearErrors, handleZodErrors, queryClient, value, t]);

  const handleActionClick = useCallback(
    (asset: AssetResponse, action: "update" | "status" | "delete") => {
      idRef.current = asset.id;
      if (action === "update") {
        setValue({
          assetBeLongTo: asset.assetBeLongTo,
          assetType: asset.assetType,
          descriptionAsset: asset.description,
          nameAsset: asset.nameAsset,
          price: asset.price,
          quantity: asset.quantity,
          assetStatus: asset.assetStatus,
        });
        setIsModalOpen(true);
      } else if (action === "delete") {
        openDialog(
          { id: asset.id, type: action },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
      } else {
        openDialog(
          { id: asset.id, type: action },
          {
            type: "default",
            desc: t(Notice.TOGGLE_STATUS),
          }
        );
      }
    },
    [openDialog, t]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("asset.errorFetch"));
    }
    if (isStatisticsError) {
      toast.error(t("asset.errorFetchStatistics"));
    }
  }, [isError, isStatisticsError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      nameAsset,
    },
    setSearchParams,
    props,
    data,
    dataAssets,
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
