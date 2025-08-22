import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { BuildingStatus, BuildingType } from "@/enums";
import { switchGrid3 } from "@/lib/utils";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface FilterValues {
    query: string;
    status: string;
    buildingType: string;
}

export interface BuildingFilterProps {
    filterValues: FilterValues;
    setFilterValues: Dispatch<SetStateAction<FilterValues>>;
    onClear: () => void;
    onFilter: () => void;
}

const BuildingFilter = ({
    props,
    type,
}: {
    props: BuildingFilterProps;
    type: "default" | "restore";
}) => {
    const { t } = useTranslation();
    const { query, status, buildingType } = props.filterValues;
    const setFilterValues = props.setFilterValues;

    const handleChange = (key: keyof FilterValues, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onFilter();
    };

    return (
        <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
            <div className={switchGrid3(type)}>
                <RenderIf value={type === "default"}>
                    <FieldsSelectLabel
                        placeholder={t("building.filter.status")}
                        labelSelect={t("building.response.status")}
                        data={[
                            {
                                label: t("statusBadge.buildingStatus.active"),
                                value: BuildingStatus.HOAT_DONG,
                            },
                            {
                                label: t("statusBadge.buildingStatus.locked"),
                                value: BuildingStatus.TAM_KHOA,
                            },
                        ]}
                        value={status}
                        onChange={(value) => handleChange("status", String(value))}
                        name="status"
                    />
                </RenderIf>
                <FieldsSelectLabel
                    placeholder={t("building.filter.buildingType")}
                    labelSelect={t("building.response.buildingType")}
                    data={[
                        {
                            label: t("statusBadge.buildingType.canHoDichVu"),
                            value: BuildingType.CAN_HO_DICH_VU,
                        },
                        {
                            label: t("statusBadge.buildingType.chungCuMini"),
                            value: BuildingType.CHUNG_CU_MINI,
                        },
                        {
                            label: t("statusBadge.buildingType.nhaTro"),
                            value: BuildingType.NHA_TRO,
                        },
                        { label: t("statusBadge.buildingType.other"), value: BuildingType.KHAC },
                    ]}
                    value={buildingType}
                    onChange={(value) => handleChange("buildingType", String(value))}
                    name="buildingType"
                />
                <InputLabel
                    type="text"
                    id="search"
                    name="search"
                    placeholder={t("common.button.search")}
                    value={query}
                    onChange={(e) => handleChange("query", e.target.value)}
                />
            </div>
            <ButtonFilter onClear={props.onClear} />
        </form>
    );
};

export default BuildingFilter;
