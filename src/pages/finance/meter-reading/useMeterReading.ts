import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateMeterReadingSchema } from "@/lib/validation";
import {
  ApiResponse,
  MeterReadingUpdateRequest,
  MeterReadingFilter,
  MeterReadingResponse,
  MeterFindAllResponse,
  MeterInitFilterResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useMeterReading = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();

  const {
    page = "1",
    size = "15",
    buildingId = "",
    roomId = "",
    meterType = "",
    month = "",
  } = queryFilter(searchParams, "page", "size", "buildingId", "roomId", "meterType", "month");

  const activeBuildingId = id || buildingId;
  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<MeterReadingUpdateRequest>({
    descriptionMeterReading: "",
    newIndex: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<MeterReadingUpdateRequest>();

  const [filterValues, setFilterValues] = useState<MeterReadingFilter>({
    buildingId,
    meterType,
    roomId,
    month: isNumber(month) ? Number(month) : undefined,
  });

  const handleClear = () => {
    setFilterValues({
      buildingId: "",
      meterType: "",
      roomId: "",
      month: undefined,
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.buildingId) params.set("buildingId", filterValues.buildingId);
    if (filterValues.meterType) params.set("meterType", filterValues.meterType);
    if (filterValues.month) params.set("month", String(filterValues.month));
    if (filterValues.roomId) params.set("roomId", filterValues.roomId);
    params.set("page", "1");
    if (
      filterValues.buildingId ||
      filterValues.meterType ||
      filterValues.month ||
      filterValues.roomId
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.buildingId,
    filterValues.meterType,
    filterValues.month,
    filterValues.roomId,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<MeterReadingResponse[]>>({
    queryKey: [
      "meter-readings",
      parsedPage,
      parsedSize,
      activeBuildingId,
      month,
      roomId,
      meterType,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      if (activeBuildingId) params["buildingId"] = activeBuildingId;
      if (month) params["month"] = String(month);
      if (roomId) params["roomId"] = roomId;
      if (meterType) params["meterType"] = meterType;

      const res = await httpRequest.get("/meter-readings", { params });
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

  const updateMeterReadingMutation = useMutation({
    mutationKey: ["update-meter-reading"],
    mutationFn: async (payload: MeterReadingUpdateRequest) =>
      await httpRequest.put(`/meter-readings/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeMeterReadingMutation = useMutation({
    mutationKey: ["remove-meter-reading"],
    mutationFn: async (id: string) => await httpRequest.delete(`/meter-readings/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveMeterReadingById(id);
      return false;
    },
  });

  const handleRemoveMeterReadingById = async (id: string): Promise<boolean> => {
    try {
      await removeMeterReadingMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "meter-readings",
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

  const handleUpdateDefaultService = useCallback(async () => {
    try {
      const { descriptionMeterReading, newIndex } = value;

      await updateMeterReadingSchema.parseAsync(value);

      const data: MeterReadingUpdateRequest = {
        descriptionMeterReading: descriptionMeterReading.trim(),
        newIndex,
      };

      updateMeterReadingMutation.mutate(data, {
        onSuccess: () => {
          setValue({ descriptionMeterReading: "", newIndex: undefined });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "meter-readings",
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
  }, [value, updateMeterReadingMutation, clearErrors, queryClient, t, handleZodErrors]);

  const handleActionClick = useCallback(
    (meterReading: MeterReadingResponse, action: "update" | "delete") => {
      idRef.current = meterReading.id;
      if (action === "update") {
        setValue({
          descriptionMeterReading: meterReading.descriptionMeterReading,
          newIndex: meterReading.newIndex,
        });
        setIsModalOpen(true);
      } else {
        openDialog({ id: meterReading.id, type: action }, { type: "warn", desc: t(Notice.REMOVE) });
      }
    },
    [openDialog, t]
  );

  const { data: meterFindAll, isError: errorMeterFindAll } = useQuery<
    ApiResponse<MeterFindAllResponse>
  >({
    queryKey: ["meters-find-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/meters/find-all");
      return res.data;
    },
    retry: 1,
  });

  const { data: filterMeterInit, isError: errorFilterMeterInit } = useQuery<
    ApiResponse<MeterInitFilterResponse>
  >({
    queryKey: ["meters-filter-init"],
    queryFn: async () => {
      const res = await httpRequest.get(`/meters/init-filter/${id}`);
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
    meterFilter: filterMeterInit,
  };

  useEffect(() => {
    if (isError) toast.error(t("meterReading.errorFetch"));
    if (errorMeterFindAll) toast.error(t("meter.errorFetch"));
    if (errorFilterMeterInit) toast.error(t("meterReading.errorFetchStatistics"));
  }, [errorFilterMeterInit, errorMeterFindAll, isError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      buildingId: activeBuildingId,
      month,
      meterType,
      roomId,
    },
    meterFindAll,
    setSearchParams,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    filterMeterInit,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor: handleUpdateDefaultService,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
