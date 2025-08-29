import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { MeterType } from "@/enums";
import { ApiResponse, MeterFilter as Filter, MeterInitFilterResponse } from "@/types";
import { Dispatch, FormEvent, SetStateAction, useMemo } from "react";
import { useTranslation } from "react-i18next";

export interface MeterFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
  meterFilter: ApiResponse<MeterInitFilterResponse> | undefined;
}

const MeterFilter = ({ props }: { props: MeterFilterProps }) => {
  const { t } = useTranslation();
  const { meterType, query, roomId } = props.filterValues;
  const meterFilter = props.meterFilter;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  const roomOptions = useMemo((): FieldsSelectLabelType[] => {
    return (
      meterFilter?.data?.rooms?.map((room) => ({
        label: room.name,
        value: room.id,
      })) ?? []
    );
  }, [meterFilter?.data?.rooms]);

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder={t("meter.filter.placeholderRoom")}
          labelSelect={t("meter.filter.labelRoom")}
          data={roomOptions}
          value={roomId}
          onChange={(value) => handleChange("roomId", String(value))}
          name="roomId"
          showClear
        />
        <FieldsSelectLabel
          placeholder={t("meter.placeholder.meterType")}
          data={[
            { label: t("statusBadge.meterType.electric"), value: MeterType.DIEN },
            { label: t("statusBadge.meterType.water"), value: MeterType.NUOC },
          ]}
          value={meterType}
          onChange={(value) => handleChange("meterType", String(value))}
          name="meterType"
          showClear
        />
        <InputLabel
          type="text"
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

export default MeterFilter;
