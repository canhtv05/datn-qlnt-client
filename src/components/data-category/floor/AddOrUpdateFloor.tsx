import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import TextareaLabel from "@/components/TextareaLabel";
import { FloorType } from "@/enums";
import { ICreateFloorValue } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface AddOrUpdateFloorProps {
    value: ICreateFloorValue;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setValue: Dispatch<React.SetStateAction<ICreateFloorValue>>;
    errors: Partial<Record<keyof ICreateFloorValue, string>>;
    type: "add" | "update";
}

const AddOrUpdateFloor = ({
    value,
    handleChange,
    setValue,
    errors,
    type,
}: AddOrUpdateFloorProps) => {
    const { t } = useTranslation();
    const floorType: FieldsSelectLabelType[] = [
        {
            label: t("statusBadge.floorType.forRent"),
            value: FloorType.CHO_THUE,
        },
        {
            label: t("statusBadge.floorType.residential"),
            value: FloorType.DE_O,
        },
        {
            label: t("statusBadge.floorType.storage"),
            value: FloorType.KHO,
        },
        {
            label: t("statusBadge.floorType.notForRent"),
            value: FloorType.KHONG_CHO_THUE,
        },
        {
            label: t("statusBadge.floorType.other"),
            value: FloorType.KHAC,
        },
    ];

    return (
        <div className="flex flex-col gap-3">
            <RenderIf value={type === "add"}>
                <InputLabel
                    id="nameFloor"
                    name="nameFloor"
                    placeholder={t("floor.addOrUpdate.nameFloor")}
                    required
                    label={t("floor.addOrUpdate.nameFloor")}
                    value={value.nameFloor ?? ""}
                    onChange={handleChange}
                    errorText={errors.nameFloor}
                />
            </RenderIf>

            <InputLabel
                id="maximumRoom"
                name="maximumRoom"
                placeholder="1"
                required
                label={t("floor.addOrUpdate.maximumRoom")}
                value={value.maximumRoom ?? ""}
                onChange={handleChange}
                errorText={errors.maximumRoom}
            />

            <FieldsSelectLabel
                data={floorType}
                placeholder={t("floor.addOrUpdate.selectFloorType")}
                label={t("floor.addOrUpdate.floorType")}
                id="buildingType"
                name="buildingType"
                value={value.floorType ?? ""}
                onChange={(val) => setValue((prev) => ({ ...prev, floorType: val as FloorType }))}
                labelSelect={t("floor.addOrUpdate.floorType")}
                showClear
                errorText={errors.floorType}
                required
            />

            <TextareaLabel
                id="descriptionFloor"
                name="descriptionFloor"
                placeholder={t("floor.addOrUpdate.placeholderDescription")}
                label={t("floor.addOrUpdate.placeholderDescription")}
                value={value.descriptionFloor ?? ""}
                onChange={(e) =>
                    setValue((prev) => ({ ...prev, descriptionFloor: e.target.value }))
                }
            />
        </div>
    );
};

export default AddOrUpdateFloor;
