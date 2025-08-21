import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, FloorResponse } from "@/types";
import { useHistoryFloor } from "./useHistoryFloor";
import { BUTTON_HISTORY, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
import FloorFilter from "@/components/data-category/floor/FloorFilter";
import { useTranslation } from "react-i18next";

const HistoryFloor = () => {
    const {
        ConfirmDialog,
        data,
        handleActionClick,
        isLoading,
        props,
        query,
        rowSelection,
        setRowSelection,
        ConfirmDialogRemoveAll,
        openDialogAll,
    } = useHistoryFloor();
    const { page, size } = query;
    const { t } = useTranslation();

    const columnConfigs: ColumnConfig[] = [
        { label: t("floor.response.nameFloor"), accessorKey: "nameFloor", isSort: true },
        {
            label: t("floor.response.actions"),
            accessorKey: "actions",
            isSort: false,
            isCenter: true,
            render: (row: FloorResponse) => {
                const floor: FloorResponse = row;
                return (
                    <div className="flex gap-2">
                        {GET_BTNS("delete", "undo").map((btn, index) => (
                            <TooltipProvider key={index}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size={"icon"}
                                            variant={btn.type}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                handleActionClick(floor, btn.type);
                                            }}
                                        >
                                            <btn.icon className="text-white" />
                                        </Button>
                                    </TooltipTrigger>
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
                                            className={
                                                "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                                            }
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>
                );
            },
        },
        { label: t("floor.response.buildingName"), accessorKey: "buildingName", isSort: true },
        {
            label: t("floor.response.maximumRoom"),
            accessorKey: "maximumRoom",
            isSort: true,
            isCenter: true,
        },
        {
            label: t("floor.response.nameFloor"),
            accessorKey: "floorType",
            hasBadge: true,
            isCenter: true,
            isSort: true,
        },
        { label: t("floor.response.descriptionFloor"), accessorKey: "descriptionFloor" },
        {
            label: t("floor.response.status"),
            accessorKey: "status",
            isSort: true,
            hasBadge: true,
            isCenter: true,
        },
        {
            label: t("floor.response.createdAt"),
            accessorKey: "createdAt",
            isSort: true,
            hasDate: true,
        },
        {
            label: t("floor.response.updatedAt"),
            accessorKey: "updatedAt",
            isSort: true,
            hasDate: true,
        },
    ];

    return (
        <div className="flex flex-col shadow-lg rounded-md">
            <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
                <div className="h-full bg-background rounded-t-sm">
                    <div className="flex px-5 py-3 justify-between items-center">
                        <h3 className="font-semibold"> {t("floor.titleHistory")}</h3>
                        <div className="flex gap-2">
                            {BUTTON_HISTORY.map((btn, idx) => (
                                <TooltipProvider key={idx}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size={"icon"}
                                                variant={btn.type}
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    if (btn.type === "delete") {
                                                        openDialogAll(
                                                            { ids: rowSelection, type: "remove" },
                                                            {
                                                                desc: t(
                                                                    "common.confirmDialog.delete",
                                                                    { name: t("floor.title") }
                                                                ),
                                                                type: "warn",
                                                            }
                                                        );
                                                    } else if (btn.type === "undo") {
                                                        openDialogAll(
                                                            { ids: rowSelection, type: "undo" },
                                                            {
                                                                desc: t(Notice.RESTORES),
                                                                type: "default",
                                                            }
                                                        );
                                                    }
                                                }}
                                                disabled={
                                                    !Object.values(rowSelection).some(Boolean)
                                                }
                                            >
                                                <btn.icon className="text-white" />
                                            </Button>
                                        </TooltipTrigger>
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
                                                className={
                                                    "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                                                }
                                            />
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    </div>
                </div>
                <FloorFilter props={props} type="restore" />
                <DataTable<FloorResponse>
                    data={data?.data ?? []}
                    columns={buildColumnsFromConfig(columnConfigs)}
                    page={page}
                    size={size}
                    totalElements={data?.meta?.pagination?.total || 0}
                    totalPages={data?.meta?.pagination?.totalPages || 0}
                    loading={isLoading}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                />
            </div>
            <ConfirmDialog />
            <ConfirmDialogRemoveAll />
        </div>
    );
};

export default HistoryFloor;
