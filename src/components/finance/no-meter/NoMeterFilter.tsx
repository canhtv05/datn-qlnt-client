import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { RoomStatus, RoomType } from "@/enums";
import { RoomNoMeterFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface NoMeterFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const NoMeterFilter = ({ props }: { props: NoMeterFilterProps }) => {
  const { t } = useTranslation();
  const { maxPrice, minPrice, query, roomType, status } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end rounded-t-md" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
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
          placeholder={t("room.filter.status")}
          labelSelect={t("room.response.status")}
          data={[
            { label: t("statusBadge.roomStatus.empty"), value: RoomStatus.TRONG },
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
            // {
            //   label: t("statusBadge.roomStatus.inactive"),
            //   value: RoomStatus.HUY_HOAT_DONG,
            // },
          ]}
          value={status}
          onChange={(value) => handleChange("status", String(value))}
          name="status"
          showClear
        />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          type="text"
          id="minPrice"
          name="minPrice"
          placeholder={t("service.filter.minPrice")}
          value={minPrice !== undefined ? String(minPrice) : ""}
          onChange={(e) => handleChange("minPrice", e.target.value)}
        />
        <InputLabel
          type="number"
          id="maxPrice"
          name="maxPrice"
          placeholder={t("service.filter.maxPrice")}
          value={maxPrice !== undefined ? String(maxPrice) : ""}
          onChange={(e) => handleChange("maxPrice", e.target.value)}
        />
        <InputLabel
          type="number"
          id="query"
          name="query"
          placeholder={t("meter.search")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default NoMeterFilter;
