import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { RoomStatus, RoomType } from "@/enums";
import { AssetRoomFilter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface RoomFilterProps {
  filterValues: AssetRoomFilter;
  setFilterValues: Dispatch<SetStateAction<AssetRoomFilter>>;
  onClear: () => void;
  onFilter: () => void;
}

const RoomAssetFilter = ({ props }: { props: RoomFilterProps }) => {
  const { t } = useTranslation();
  const { filterValues, setFilterValues, onClear, onFilter } = props;
  const { status, roomType, query } = filterValues;

  const handleChange = (key: keyof AssetRoomFilter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter();
  };

  return (
    <form
      className="bg-background p-5 flex flex-col gap-2 items-end rounded-t-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-3 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder={t("room.filter.roomType")}
          labelSelect={t("room.response.roomType")}
          data={[
            { label: t("statusBadge.roomType.vip"), value: RoomType.CAO_CAP },
            { label: t("statusBadge.roomType.single"), value: RoomType.DON },
            { label: t("statusBadge.roomType.shared"), value: RoomType.GHEP },
            { label: t("statusBadge.roomType.other"), value: RoomType.KHAC },
          ]}
          value={roomType}
          onChange={(value) => handleChange("roomType", String(value))}
          name="roomType"
          showClear
        />
        <FieldsSelectLabel
          placeholder={t("roomAsset.filter.status")}
          labelSelect={t("roomAsset.response.status")}
          data={[
            { label: t("statusBadge.roomStatus.empty"), value: RoomStatus.TRONG },
            {
              label: t("statusBadge.roomStatus.renting"),
              value: RoomStatus.DANG_THUE,
            },
            { label: t("statusBadge.roomStatus.deposit"), value: RoomStatus.DA_DAT_COC },
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
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
          showClear
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder={t("roomAsset.addOrUpdate.placeholderSearch")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={onClear} />
    </form>
  );
};

export default RoomAssetFilter;
