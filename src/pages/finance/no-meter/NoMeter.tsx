import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { ColumnConfig, RoomNoMeterResponse } from "@/types";
import { useTranslation } from "react-i18next";
import { useNoMeter } from "./useNoMeter";
import NoMeterFilter from "@/components/finance/no-meter/NoMeterFilter";

const NoMeter = () => {
  const { props, data, isLoading, query } = useNoMeter();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("room.response.roomCode"),
      accessorKey: "roomCode",
      isSort: true,
      hasHighlight: true,
      isCenter: true,
    },
    {
      label: t("floor.response.nameFloor"),
      accessorKey: "nameFloor",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("room.response.price"),
      accessorKey: "price",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("room.response.roomType"),
      accessorKey: "roomType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      hasBadge: true,
      label: t("room.response.status"),
      accessorKey: "status",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("room.response.description"),
      accessorKey: "description",
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="shadow-lg bg-background  rounded-md">
        <NoMeterFilter props={props} />
        <DataTable<RoomNoMeterResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs, false)}
          page={Number(page)}
          size={Number(size)}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={{}}
          setRowSelection={() => {}}
          disableSelect
        />
      </div>
    </div>
  );
};

export default NoMeter;
