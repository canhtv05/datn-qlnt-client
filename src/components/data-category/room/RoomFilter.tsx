import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { RoomStatus } from "@/enums";
import { switchGrid3 } from "@/lib/utils";
import { ApiResponse, FloorBasicResponse, FilterRoomValues } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface RoomFilterProps {
  filterValues: FilterRoomValues;
  setFilterValues: Dispatch<SetStateAction<FilterRoomValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const RoomFilter = ({ props, type }: { props: RoomFilterProps; type: "default" | "restore" }) => {
  const { t } = useTranslation();
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { status, maxPrice, minPrice, maxAcreage, minAcreage, maximumPeople, buildingId, floorId } =
    filterValues;

  const handleChange = (key: keyof FilterRoomValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  // const { data: buildingData, isError: isBuildingError } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
  //   queryKey: ["buildings-cards"],
  //   queryFn: async () => {
  //     const res = await httpRequest.get("/buildings/cards");
  //     return res.data;
  //   },
  // });

  const { data: floorData, isError: isFloorError } = useQuery<ApiResponse<FloorBasicResponse[]>>({
    queryKey: ["floor-list", buildingId],
    queryFn: async () => {
      const res = await httpRequest.get("/floors/find-all", {
        params: { buildingId },
      });
      return res.data;
    },
    enabled: !!buildingId,
  });

  // if (isBuildingError) toast.error("Không lấy được danh sách tòa nhà");
  if (isFloorError) toast.error(t("floor.errorFetch"));

  // const buildingOptions = useMemo(() => {
  //   return (buildingData?.data ?? []).map((b) => ({
  //     label: b.buildingName,
  //     value: b.id,
  //   }));
  // }, [buildingData]);

  const floorOptions = useMemo(() => {
    return (floorData?.data ?? []).map((f) => ({
      label: f.nameFloor,
      value: f.id,
    }));
  }, [floorData]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid3(type)}>
        {/* 1. Tòa nhà */}
        {/* <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={buildingOptions}
          value={buildingId}
          onChange={(value) => handleChange("buildingId", String(value))}
          name="buildingId"
          showClear
        /> */}

        {/* 2. Tầng */}
        <FieldsSelectLabel
          placeholder={t("room.filter.floorName")}
          labelSelect={t("room.response.floorName")}
          data={floorOptions}
          value={floorId}
          onChange={(value) => handleChange("floorId", String(value))}
          name="floorId"
          showClear
        />

        <RenderIf value={type === "default"}>
          {/* 3. Trạng thái */}
          <FieldsSelectLabel
            placeholder={t("room.filter.status")}
            labelSelect={t("room.response.status")}
            data={[
              { label: t("statusBadge.roomStatus.active"), value: RoomStatus.TRONG },
              {
                label: t("statusBadge.roomStatus.renting"),
                value: RoomStatus.DANG_THUE,
              },
              {
                label: t("statusBadge.roomStatus.deposit"),
                value: RoomStatus.DA_DAT_COC,
              },
              {
                label: t("statusBadge.roomStatus.maintain"),
                value: RoomStatus.DANG_BAO_TRI,
              },
              {
                label: t("statusBadge.roomStatus.unfinished"),
                value: RoomStatus.CHUA_HOAN_THIEN,
              },
              {
                label: t("statusBadge.roomStatus.locked"),
                value: RoomStatus.TAM_KHOA,
              },
              {
                label: t("statusBadge.roomStatus.inactive"),
                value: RoomStatus.HUY_HOAT_DONG,
              },
            ]}
            value={status}
            onChange={(value) => handleChange("status", String(value))}
            name="status"
            showClear
          />
        </RenderIf>

        {/* 4. Số người tối đa */}
        <InputLabel
          type="number"
          id="maximumPeople"
          name="maximumPeople"
          placeholder={t("room.response.maximumPeople")}
          value={maximumPeople}
          onChange={(e) => handleChange("maximumPeople", e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        {/* 5. Khoảng giá */}
        <div className="flex gap-2">
          <InputLabel
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder={t("room.response.minPrice")}
            value={minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
          />
          <InputLabel
            type="number"
            id="maxPrice"
            name="maxPrice"
            placeholder={t("room.response.maxPrice")}
            value={maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
          />
        </div>

        {/* 6. Khoảng diện tích */}
        <div className="flex gap-2">
          <InputLabel
            type="number"
            id="minAcreage"
            name="minAcreage"
            placeholder={t("room.response.minAcreage")}
            value={minAcreage}
            onChange={(e) => handleChange("minAcreage", e.target.value)}
          />
          <InputLabel
            type="number"
            id="maxAcreage"
            name="maxAcreage"
            placeholder={t("room.response.maxAcreage")}
            value={maxAcreage}
            onChange={(e) => handleChange("maxAcreage", e.target.value)}
          />
        </div>
      </div>
      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default RoomFilter;
