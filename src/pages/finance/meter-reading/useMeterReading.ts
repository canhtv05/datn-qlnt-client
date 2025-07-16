import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateMeterReadingSchema } from "@/lib/validation";
import {
  ApiResponse,
  MeterReadingUpdateRequest,
  MeterInitFilterResponse,
  MeterReadingFilter,
  MeterReadingResponse,
  MeterFindAllResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useMeterReading = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    buildingId = "",
    roomId = "",
    meterType = "",
    month = "",
  } = queryFilter(searchParams, "page", "size", "buildingId", "roomId", "meterType", "month");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<MeterReadingUpdateRequest>({
    descriptionMeterReading: "",
    month: undefined,
    newIndex: undefined,
    oldIndex: undefined,
    readingDate: "",
    year: undefined,
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
    if (filterValues.buildingId || filterValues.meterType || filterValues.month || filterValues.roomId) {
      setSearchParams(params);
    }
  }, [filterValues.buildingId, filterValues.meterType, filterValues.month, filterValues.roomId, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<MeterReadingResponse[]>>({
    queryKey: ["meter-readings", page, size, buildingId, month, roomId, meterType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (buildingId) params["buildingId"] = buildingId;
      if (month) params["month"] = month;
      if (roomId) params["roomId"] = roomId;
      if (meterType) params["meterType"] = meterType;

      const res = await httpRequest.get("/meter-readings", {
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
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "meter-readings",
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

  const handleUpdateDefaultService = useCallback(async () => {
    try {
      const { descriptionMeterReading, month, newIndex, oldIndex, readingDate, year } = value;

      await updateMeterReadingSchema.parseAsync(value);

      const data: MeterReadingUpdateRequest = {
        descriptionMeterReading: descriptionMeterReading.trim(),
        month,
        newIndex,
        oldIndex,
        readingDate,
        year,
      };

      updateMeterReadingMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            descriptionMeterReading: "",
            month: undefined,
            newIndex: undefined,
            oldIndex: undefined,
            readingDate: "",
            year: undefined,
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "meter-readings",
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
  }, [updateMeterReadingMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (meterReading: MeterReadingResponse, action: "update" | "delete") => {
      idRef.current = meterReading.id;
      if (action === "update") {
        setValue({
          descriptionMeterReading: meterReading.descriptionMeterReading,
          month: meterReading.month,
          newIndex: meterReading.newIndex,
          oldIndex: meterReading.oldIndex,
          readingDate: meterReading.readingDate,
          year: meterReading.year,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: meterReading.id, type: action },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      }
    },
    [openDialog]
  );

  const { data: meterFindAll, isError: errorMeterFindAll } = useQuery<ApiResponse<MeterFindAllResponse>>({
    queryKey: ["meters-find-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/meters/find-all");
      return res.data;
    },
    retry: 1,
  });

  const { data: filterMeterInit, isError: errorFilterMeterInit } = useQuery<ApiResponse<MeterInitFilterResponse>>({
    queryKey: ["meters-filter-init"],
    queryFn: async () => {
      const res = await httpRequest.get("/meters/init-filter");
      return res.data;
    },
    retry: 1,
  });

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
    meterFilter: filterMeterInit,
  };

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải ghi chỉ số");
    }

    if (errorMeterFindAll) {
      toast.error("Có lỗi xảy ra khi tải công tơ");
    }

    if (errorFilterMeterInit) {
      toast.error("Có lỗi xảy ra khi tải lọc ghi chỉ số");
    }
  }, [errorFilterMeterInit, errorMeterFindAll, isError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      buildingId,
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
