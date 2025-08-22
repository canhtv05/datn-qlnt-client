import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { FloorStatus, FloorType } from "@/enums";
import { switchGrid4 } from "@/lib/utils";
import { FloorFilterValues } from "@/types";
// import { httpRequest } from "@/utils/httpRequest";
// import { useQuery } from "@tanstack/react-query";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";

export interface FloorFilterProps {
    filterValues: FloorFilterValues;
    setFilterValues: Dispatch<SetStateAction<FloorFilterValues>>;
    onClear: () => void;
    onFilter: () => void;
}

const FloorFilter = ({ props, type }: { props: FloorFilterProps; type: "default" | "restore" }) => {
    const { t } = useTranslation();
    const { status, maxRoom, nameFloor, floorType } = props.filterValues;
    const setFilterValues = props.setFilterValues;
    // const { id } = useParams();

    const handleChange = (key: keyof FloorFilterValues, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onFilter();
    };

    // const { data, isError } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
    //   queryKey: ["buildings-cards"],
    //   queryFn: async () => {
    //     const res = await httpRequest.get("/buildings/cards");
    //     return res.data;
    //   },
    //   retry: 1,
    // });

    // if (isError) toast.error("Không lấy được dữ liệu tòa nhà");

    // const mapValueAndLabel = useMemo(() => {
    //   const buildings: IBuildingCardsResponse[] = data?.data ?? [];
    //   return buildings.map((building) => ({
    //     label: building.buildingName,
    //     value: building.id,
    //   }));
    // }, [data]);

    return (
        <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
            <div className={switchGrid4(type)}>
                <RenderIf value={type === "default"}>
                    <FieldsSelectLabel
                        placeholder={t("floor.filter.status")}
                        labelSelect={t("floor.response.status")}
                        data={[
                            {
                                label: t("statusBadge.floorStatus.active"),
                                value: FloorStatus.HOAT_DONG,
                            },
                            {
                                label: t("statusBadge.floorStatus.locked"),
                                value: FloorStatus.TAM_KHOA,
                            },
                        ]}
                        value={status}
                        onChange={(value) => handleChange("status", String(value))}
                        name="status"
                        showClear
                    />
                </RenderIf>
                <FieldsSelectLabel
                    placeholder={t("floor.filter.floorType")}
                    labelSelect={t("floor.response.floorType")}
                    data={[
                        { label: t("statusBadge.floorType.forRent"), value: FloorType.CHO_THUE },
                        { label: t("statusBadge.floorType.notForRent"), value: FloorType.DE_O },
                        { label: t("statusBadge.floorType.residential"), value: FloorType.KHO },
                        {
                            label: t("statusBadge.floorType.storage"),
                            value: FloorType.KHONG_CHO_THUE,
                        },
                        { label: t("statusBadge.floorType.other"), value: FloorType.KHAC },
                    ]}
                    value={floorType}
                    onChange={(value) => handleChange("floorType", String(value))}
                    name="floorType"
                    showClear
                />
                {/* <FieldsSelectLabel
          placeholder="-- Tòa nhà --"
          labelSelect="Tòa nhà"
          data={mapValueAndLabel}
          value={buildingId || id}
          onChange={(value) => handleChange("buildingId", String(value))}
          name="buildingId"
          showClear
        /> */}
                <InputLabel
                    type="text"
                    id="nameFloor"
                    name="nameFloor"
                    placeholder={t("floor.addOrUpdate.nameFloor")}
                    value={nameFloor}
                    onChange={(e) => handleChange("nameFloor", e.target.value)}
                />
                <InputLabel
                    type="number"
                    id="maxRoom"
                    name="maxRoom"
                    placeholder={t("floor.addOrUpdate.maximumRoom")}
                    value={maxRoom}
                    onChange={(e) => handleChange("maxRoom", e.target.value)}
                />
            </div>
            <ButtonFilter onClear={props.onClear} />
        </form>
    );
};

export default FloorFilter;
