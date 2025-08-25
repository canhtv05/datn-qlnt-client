import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Notice, Status } from "@/enums";
import {
  createServiceRoomForBuildingSchema,
  createServiceRoomForRoomSchema,
  createServiceRoomForServiceSchema,
  createServiceRoomSchema,
} from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import {
  IBtnType,
  Option,
  ServiceRoomCreationForBuildingRequest,
  ServiceRoomCreationForRoomRequest,
  ServiceRoomCreationForServiceRequest,
  ServiceRoomCreationRequest,
  ServiceRoomView,
} from "@/types";
import { ACTION_BUTTONS_SERVICE_ROOM } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import CreateRoomService from "./CreateRoomService";
import { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import CreateRoomServiceForBuilding from "./CreateRoomServiceForBuilding";
import CreateRoomServiceForService from "./CreateRoomServiceForService";
import CreateRoomServiceForRoom from "./CreateRoomServiceForRoom";
import { useParams } from "react-router-dom";
import { handleExportExcel, roomStatusEnumToString, roomTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const ServiceRoomButton = ({
  ids,
  roomOptions,
  serviceOptions,
  buildingOptions,
  data,
}: {
  ids: Record<string, boolean>;
  serviceOptions: FieldsSelectLabelType[] | Option[] | undefined;
  roomOptions: FieldsSelectLabelType[] | Option[] | undefined;
  buildingOptions: FieldsSelectLabelType[] | Option[] | undefined;
  data?: ServiceRoomView[];
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [value, setValue] = useState<ServiceRoomCreationRequest>({
    roomId: "",
    serviceId: "",
  });

  const [valueForBuilding, setValueForBuilding] = useState<ServiceRoomCreationForBuildingRequest>({
    buildingId: "",
    serviceId: "",
  });

  const [valueForService, setValueForService] = useState<ServiceRoomCreationForServiceRequest>({
    roomIds: [],
    serviceId: "",
  });

  const [valueForRoom, setValueForRoom] = useState<ServiceRoomCreationForRoomRequest>({
    serviceIds: [],
    roomId: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceRoomCreationRequest>();

  const {
    clearErrors: clearErrorsForBuilding,
    errors: errorsForBuilding,
    handleZodErrors: handleZodErrorsForBuilding,
  } = useFormErrors<ServiceRoomCreationForBuildingRequest>();

  const {
    clearErrors: clearErrorsForService,
    errors: errorsForService,
    handleZodErrors: handleZodErrorsForService,
  } = useFormErrors<ServiceRoomCreationForServiceRequest>();

  const {
    clearErrors: clearErrorsForRoom,
    errors: errorsForRoom,
    handleZodErrors: handleZodErrorsForRoom,
  } = useFormErrors<ServiceRoomCreationForRoomRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addServiceRoomMutation = useMutation({
    mutationKey: ["add-service-room"],
    mutationFn: async (payload: ServiceRoomCreationRequest) =>
      await httpRequest.post("/service-rooms", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));
      setValue({
        roomId: "",
        serviceId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
    },
  });

  const handleAddServiceRoom = useCallback(async () => {
    try {
      const { roomId, serviceId } = value;

      const data: ServiceRoomCreationRequest = {
        roomId: roomId ?? "",
        serviceId: serviceId ?? "",
      };

      await createServiceRoomSchema.parseAsync(data);
      await addServiceRoomMutation.mutateAsync(data);
      clearErrorsForBuilding();
      return true;
    } catch (error) {
      handleZodErrorsForBuilding(error);
      return false;
    }
  }, [addServiceRoomMutation, clearErrorsForBuilding, handleZodErrorsForBuilding, value]);

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeServiceRoomMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });

      toast.success(t(Status.REMOVE_SUCCESS));
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveAssetTypeByIds(ids);
    },
    desc: t("common.confirmDialog.delete", { name: t("serviceRoom.title") }),
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          [t("serviceRoom.response.roomCode")]: d.roomCode,
          [t("serviceRoom.response.totalServices")]: d.totalServices,
          [t("serviceRoom.response.roomType")]: roomTypeEnumToString(d.roomType, t),
          [t("serviceRoom.response.status")]: roomStatusEnumToString(d.status, t),
          [t("serviceRoom.response.descriptionServiceRoom")]: d.description,
        }));
        handleExportExcel(`t("serviceRoom.title")`, exportData, data);
      }
    },
    [data, ids, openDialog, t]
  );

  const removeServiceRoomMutation = useMutation({
    mutationKey: ["remove-service-rooms"],
    mutationFn: async (id: string) => await httpRequest.delete(`/service-rooms/${id}`),
  });

  const addServiceRoomForBuildingMutation = useMutation({
    mutationKey: ["add-service-room-for-building"],
    mutationFn: async (payload: ServiceRoomCreationForBuildingRequest) =>
      await httpRequest.post("/service-rooms/by-building", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));
      setValueForBuilding({
        buildingId: "",
        serviceId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
    },
  });

  const handleAddServiceRoomForBuilding = useCallback(async () => {
    try {
      const { serviceId } = valueForBuilding;

      const data: ServiceRoomCreationForBuildingRequest = {
        buildingId: id ?? "",
        serviceId: serviceId ?? "",
      };

      await createServiceRoomForBuildingSchema.parseAsync(data);
      await addServiceRoomForBuildingMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addServiceRoomForBuildingMutation, clearErrors, handleZodErrors, id, valueForBuilding]);

  const addServiceRoomForServiceMutation = useMutation({
    mutationKey: ["add-service-room-for-service"],
    mutationFn: async (payload: ServiceRoomCreationForServiceRequest) =>
      await httpRequest.post("/service-rooms/by-service", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));
      setValueForService({
        roomIds: [],
        serviceId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
    },
  });

  const handleAddServiceRoomForService = useCallback(async () => {
    try {
      const { serviceId, roomIds } = valueForService;

      const data: ServiceRoomCreationForServiceRequest = {
        roomIds: roomIds ?? [],
        serviceId: serviceId ?? "",
      };

      await createServiceRoomForServiceSchema.parseAsync(data);
      await addServiceRoomForServiceMutation.mutateAsync(data);
      clearErrorsForService();
      return true;
    } catch (error) {
      handleZodErrorsForService(error);
      return false;
    }
  }, [
    addServiceRoomForServiceMutation,
    clearErrorsForService,
    handleZodErrorsForService,
    valueForService,
  ]);

  const addServiceRoomForRoomMutation = useMutation({
    mutationKey: ["add-service-room-for-room"],
    mutationFn: async (payload: ServiceRoomCreationForRoomRequest) =>
      await httpRequest.post("/service-rooms/by-room", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));
      setValueForRoom({
        serviceIds: [],
        roomId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
    },
  });

  const handleAddServiceRoomForRoom = useCallback(async () => {
    try {
      const { roomId, serviceIds } = valueForRoom;

      const data: ServiceRoomCreationForRoomRequest = {
        serviceIds: serviceIds ?? [],
        roomId: roomId ?? "",
      };

      await createServiceRoomForRoomSchema.parseAsync(data);
      await addServiceRoomForRoomMutation.mutateAsync(data);
      clearErrorsForRoom();
      return true;
    } catch (error) {
      handleZodErrorsForRoom(error);
      return false;
    }
  }, [addServiceRoomForRoomMutation, clearErrorsForRoom, handleZodErrorsForRoom, valueForRoom]);

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">{t("serviceRoom.title")}</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_SERVICE_ROOM.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title={t("serviceRoom.titleAddOneServiceToOneRoom")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddServiceRoom}
                  >
                    <CreateRoomService
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      roomOptions={roomOptions}
                      serviceOptions={serviceOptions}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "building"}>
                  <Modal
                    title={t("serviceRoom.titleAddOneServiceToAllRoomsInBuilding")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddServiceRoomForBuilding}
                  >
                    <CreateRoomServiceForBuilding
                      handleChange={handleChange}
                      value={valueForBuilding}
                      setValue={setValueForBuilding}
                      errors={errorsForBuilding}
                      buildingOptions={buildingOptions}
                      serviceOptions={serviceOptions}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "floor"}>
                  <Modal
                    title={t("serviceRoom.titleAddOneServiceToMultipleRooms")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddServiceRoomForService}
                  >
                    <CreateRoomServiceForService
                      handleChange={handleChange}
                      value={valueForService}
                      setValue={setValueForService}
                      errors={errorsForService}
                      serviceOptions={serviceOptions as Option[]}
                      roomOptions={roomOptions as Option[]}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "undo"}>
                  <Modal
                    title={t("serviceRoom.titleAddMultipleServicesToOneRoom")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddServiceRoomForRoom}
                  >
                    <CreateRoomServiceForRoom
                      handleChange={handleChange}
                      value={valueForRoom}
                      setValue={setValueForRoom}
                      errors={errorsForRoom}
                      serviceOptions={serviceOptions as Option[]}
                      roomOptions={roomOptions as Option[]}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "download"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => handleButton(btn)}
                      // disabled={btn.type === "delete" && !Object.values(ids).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
                <TooltipContent
                  className="text-white"
                  style={{
                    background: btn.arrowColor,
                  }}
                  arrow={false}
                >
                  <p>{t(btn.tooltipContent)}</p>
                  <TooltipPrimitive.Arrow
                    style={{
                      fill: btn.arrowColor,
                      background: btn.arrowColor,
                    }}
                    className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default ServiceRoomButton;
