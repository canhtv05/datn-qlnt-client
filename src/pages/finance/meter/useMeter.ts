import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateMeterSchema } from "@/lib/validation";
import {
  ApiResponse,
  CreateMeterInitResponse,
  MeterCreationAndUpdatedRequest,
  MeterFilter,
  MeterInitFilterResponse,
  MeterResponse,
  PaginatedResponse,
  RoomNoMeterCountStatistics,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useMeter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const {
    page = "1",
    size = "15",
    buildingId = "",
    roomId = "",
    meterType = "",
    query = "",
  } = queryFilter(searchParams, "page", "size", "buildingId", "roomId", "meterType", "query");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<MeterCreationAndUpdatedRequest>({
    descriptionMeter: "",
    closestIndex: 0,
    manufactureDate: "",
    meterCode: "",
    meterName: "",
    meterType: "",
    roomId: "",
    serviceId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<MeterCreationAndUpdatedRequest>();

  const [filterValues, setFilterValues] = useState<MeterFilter>({
    buildingId,
    meterType,
    query,
    roomId,
  });

  const handleClear = () => {
    setFilterValues({
      buildingId: "",
      meterType: "",
      query: "",
      roomId: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.buildingId) params.set("buildingId", filterValues.buildingId);
    if (filterValues.meterType) params.set("meterType", filterValues.meterType);
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.roomId) params.set("roomId", filterValues.roomId);
    params.set("page", "1");
    if (filterValues.buildingId || filterValues.meterType || filterValues.query || filterValues.roomId) {
      setSearchParams(params);
    }
  }, [filterValues.buildingId, filterValues.meterType, filterValues.query, filterValues.roomId, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<PaginatedResponse<MeterResponse[]>>>({
    queryKey: ["meters", page, size, buildingId, query, id, roomId, meterType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (id) params["buildingId"] = id;
      if (query) params["query"] = query;
      if (roomId) params["roomId"] = roomId;
      if (meterType) params["meterType"] = meterType;

      const res = await httpRequest.get("/meters", {
        params,
      });

      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateMeterMutation = useMutation({
    mutationKey: ["update-meter"],
    mutationFn: async (payload: MeterCreationAndUpdatedRequest) =>
      await httpRequest.put(`/meters/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeMeterMutation = useMutation({
    mutationKey: ["remove-meter"],
    mutationFn: async (id: string) => await httpRequest.delete(`/meters/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveMeterById(id);
      return false;
    },
  });

  const handleRemoveMeterById = async (id: string): Promise<boolean> => {
    try {
      await removeMeterMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "meters",
          });
          // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
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
      const { descriptionMeter, closestIndex, manufactureDate, meterCode, meterName, meterType, roomId, serviceId } =
        value;

      await createOrUpdateMeterSchema.parseAsync(value);

      const data: MeterCreationAndUpdatedRequest = {
        descriptionMeter: descriptionMeter.trim(),
        closestIndex: closestIndex || 0,
        manufactureDate,
        meterCode: meterCode.trim(),
        meterName: meterName.trim(),
        meterType,
        roomId: roomId.trim(),
        serviceId: serviceId.trim(),
      };

      updateMeterMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            descriptionMeter: "",
            closestIndex: 0,
            manufactureDate: "",
            meterCode: "",
            meterName: "",
            meterType: "",
            roomId: "",
            serviceId: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "meters",
          });
          // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
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
  }, [value, updateMeterMutation, clearErrors, queryClient, t, handleZodErrors]);

  const handleActionClick = useCallback(
    (meter: MeterResponse, action: "update" | "delete") => {
      idRef.current = meter.id;
      if (action === "update") {
        setValue({
          descriptionMeter: meter.descriptionMeter,
          closestIndex: meter.closestIndex,
          manufactureDate: meter.manufactureDate,
          meterCode: meter.meterCode,
          meterName: meter.meterName,
          meterType: meter.meterType,
          roomId: meter.roomId,
          serviceId: meter.serviceId,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: meter.id, type: action },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
      }
    },
    [openDialog, t]
  );

  const { data: meterInit, isError: errorMeterInit } = useQuery<ApiResponse<CreateMeterInitResponse>>({
    queryKey: ["meters-init"],
    queryFn: async () => {
      const res = await httpRequest.get(`/meters/init/${id}`);
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });

  const { data: filterMeterInit, isError: errorFilterMeterInit } = useQuery<ApiResponse<MeterInitFilterResponse>>({
    queryKey: ["meters-filter-init"],
    queryFn: async () => {
      const res = await httpRequest.get(`/meters/init-filter/${id}`);
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });

  const { data: countNoMeter, isError: errorCountMeter } = useQuery<ApiResponse<RoomNoMeterCountStatistics>>({
    queryKey: ["count-no-meter"],
    queryFn: async () => {
      const res = await httpRequest.get(`/meters/no-meter/count`);
      return res.data;
    },
    retry: 1,
  });

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
    meterInit,
    meterFilter: filterMeterInit,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("meter.errorFetch"));
    }

    if (errorMeterInit) {
      toast.error(t("meter.errorFetch"));
    }

    if (errorFilterMeterInit) {
      toast.error(t("meter.errorFetch"));
    }

    if (errorCountMeter) {
      toast.error(t("meter.errorFetch"));
    }
  }, [errorCountMeter, errorFilterMeterInit, errorMeterInit, isError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      buildingId,
      query,
      meterType,
      roomId,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    filterMeterInit,
    meterInit,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor: handleUpdateDefaultService,
    countNoMeter,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
