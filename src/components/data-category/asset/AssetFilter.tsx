import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import { AssetBeLongTo, AssetStatus } from "@/enums";
import { switchGrid3 } from "@/lib/utils";
import { AssetFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface AssetFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const AssetFilter = ({ props, type }: { props: AssetFilterProps; type: "default" | "restore" }) => {
  const { t } = useTranslation();
  const { nameAsset, assetBeLongTo, assetStatus } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className={switchGrid3(type)}>
        <FieldsSelectLabel
          placeholder={t("asset.filter.assetBeLongTo")}
          labelSelect={t("asset.response.assetBeLongTo")}
          data={[
            { label: t("statusBadge.assetBelongTo.common"), value: AssetBeLongTo.CHUNG },
            { label: t("statusBadge.assetBelongTo.room"), value: AssetBeLongTo.PHONG },
          ]}
          value={assetBeLongTo}
          onChange={(value) => handleChange("assetBeLongTo", String(value))}
          name="assetBeLongTo"
          showClear
        />
        <RenderIf value={type === "default"}>
          <FieldsSelectLabel
            placeholder={t("asset.filter.status")}
            labelSelect={t("asset.response.assetStatus")}
            data={[
              { label: t("statusBadge.assetStatus.maintenance"), value: AssetStatus.CAN_BAO_TRI },
              { label: t("statusBadge.assetStatus.liquidated"), value: AssetStatus.DA_THANH_LY },
              { label: t("statusBadge.assetStatus.broken"), value: AssetStatus.HU_HONG },
              { label: t("statusBadge.assetStatus.lost"), value: AssetStatus.THAT_LAC },
              { label: t("statusBadge.assetStatus.inactive"), value: AssetStatus.KHONG_SU_DUNG },
            ]}
            value={assetStatus}
            onChange={(value) => handleChange("assetStatus", String(value))}
            name="assetStatus"
            showClear
          />
        </RenderIf>
        <InputLabel
          type="text"
          id="nameAsset"
          name="nameAsset"
          placeholder={t("asset.response.nameAsset")}
          value={nameAsset}
          onChange={(e) => handleChange("nameAsset", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default AssetFilter;
