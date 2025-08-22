import { Dispatch } from "react";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { RoomStatus, RoomType } from "@/enums";
import { RoomFormValue, FloorBasicResponse } from "@/types";
import { useTranslation } from "react-i18next";

interface Props {
    value: RoomFormValue;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setValue: Dispatch<React.SetStateAction<RoomFormValue>>;
    errors: Partial<Record<keyof RoomFormValue, string>>;
    floorList: FloorBasicResponse[];
    type: "add" | "update";
}

const AddOrUpdateRoom = ({ value, setValue, errors, floorList, type = "add" }: Props) => {
    const { t } = useTranslation();
    const roomTypes: FieldsSelectLabelType[] = [
        { label: t("statusBadge.roomType.vip"), value: RoomType.CAO_CAP },
        { label: t("statusBadge.roomType.shared"), value: RoomType.GHEP },
        { label: t("statusBadge.roomType.single"), value: RoomType.DON },
        { label: t("statusBadge.roomType.other"), value: RoomType.KHAC },
    ];

    const roomStatuses: FieldsSelectLabelType[] = [
        { label: t("statusBadge.roomStatus.empty"), value: RoomStatus.TRONG },
        { label: t("statusBadge.roomStatus.renting"), value: RoomStatus.DANG_THUE },
        { label: t("statusBadge.roomStatus.deposit"), value: RoomStatus.DA_DAT_COC },
        { label: t("statusBadge.roomStatus.maintain"), value: RoomStatus.DANG_BAO_TRI },
        { label: t("statusBadge.roomStatus.unfinished"), value: RoomStatus.CHUA_HOAN_THIEN },
        { label: t("statusBadge.roomStatus.locked"), value: RoomStatus.TAM_KHOA },
    ];
    const floorOptions: FieldsSelectLabelType[] = floorList.map((floor) => ({
        label: `${floor.nameFloor} - ${floor.buildingName}`,
        value: floor.id,
    }));

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: inputVal } = e.target;
        const parsed = Number(inputVal.trim());
        setValue((prev) => ({
            ...prev,
            [name]: inputVal.trim() === "" || isNaN(parsed) ? null : parsed,
        }));
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
                {/* FLOOR ID */}
                <FieldsSelectLabel
                    data={floorOptions}
                    placeholder={t("room.addOrUpdate.placeholderFloor")}
                    label={t("room.addOrUpdate.floorId")}
                    id="floorId"
                    name="floorId"
                    value={value.floorId ?? ""}
                    onChange={(val) => setValue((prev) => ({ ...prev, floorId: val as string }))}
                    labelSelect={t("room.addOrUpdate.floorId")}
                    showClear
                    errorText={errors.floorId}
                />

                {/* ACREAGE */}
                <InputLabel
                    id="acreage"
                    name="acreage"
                    placeholder="30"
                    type="number"
                    label={t("room.addOrUpdate.acreage")}
                    required
                    value={value.acreage ?? ""}
                    onChange={handleNumberChange}
                    errorText={errors.acreage}
                />

                {/* PRICE */}
                <InputLabel
                    id="price"
                    name="price"
                    placeholder="3000000"
                    type="number"
                    label={t("room.addOrUpdate.price")}
                    required
                    value={value.price ?? ""}
                    onChange={handleNumberChange}
                    errorText={errors.price}
                />

                {/* MAXIMUM PEOPLE */}
                <InputLabel
                    id="maximumPeople"
                    name="maximumPeople"
                    placeholder="4"
                    type="number"
                    label={t("room.addOrUpdate.maximumPeople")}
                    required
                    value={value.maximumPeople ?? ""}
                    onChange={handleNumberChange}
                    errorText={errors.maximumPeople}
                />

                {/* ROOM TYPE */}

                {/* STATUS */}
            </div>

            <FieldsSelectLabel
                data={roomTypes}
                placeholder={t("room.addOrUpdate.placeholderRoomType")}
                label={t("room.addOrUpdate.roomType")}
                id="roomType"
                name="roomType"
                value={value.roomType ?? ""}
                onChange={(val) => setValue((prev) => ({ ...prev, roomType: val as RoomType }))}
                labelSelect={t("room.addOrUpdate.roomType")}
                showClear
                errorText={errors.roomType}
                required
            />
            {type === "update" && (
                <FieldsSelectLabel
                    data={roomStatuses}
                    placeholder={t("room.addOrUpdate.placeholderStatus")}
                    label={t("room.addOrUpdate.status")}
                    id="status"
                    name="status"
                    value={value.status ?? ""}
                    onChange={(val) => setValue((prev) => ({ ...prev, status: val as RoomStatus }))}
                    labelSelect={t("room.addOrUpdate.status")}
                    showClear
                    errorText={errors.status}
                    required
                />
            )}

            {/* DESCRIPTION */}
            <TextareaLabel
                id="description"
                name="description"
                placeholder={t("room.addOrUpdate.placeholderDescription")}
                label={t("room.addOrUpdate.description")}
                value={value.description ?? ""}
                onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
            />
        </div>
    );
};

export default AddOrUpdateRoom;
