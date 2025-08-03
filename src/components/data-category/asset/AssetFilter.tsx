import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { AssetBeLongTo, AssetStatus } from "@/enums";
import { AssetFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface AssetFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const AssetFilter = ({ props }: { props: AssetFilterProps }) => {
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
      <div className="grid grid-cols-3 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Tài sản thuộc về --"
          labelSelect="Tài sản thuộc về"
          data={[
            { label: "Chung", value: AssetBeLongTo.CHUNG },
            { label: "Phòng", value: AssetBeLongTo.PHONG },
          ]}
          value={assetBeLongTo}
          onChange={(value) => handleChange("assetBeLongTo", String(value))}
          name="assetBeLongTo"
          showClear
        />
        <FieldsSelectLabel
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Cần bảo trì", value: AssetStatus.CAN_BAO_TRI },
            { label: "Đã thanh lý", value: AssetStatus.DA_THANH_LY },
            { label: "Bị hư hỏng", value: AssetStatus.HU_HONG },
            { label: "Bị thất lạc", value: AssetStatus.THAT_LAC },
            { label: "Không sử dụng", value: AssetStatus.KHONG_SU_DUNG },
          ]}
          value={assetStatus}
          onChange={(value) => handleChange("assetStatus", String(value))}
          name="assetStatus"
          showClear
        />
        <InputLabel
          type="text"
          id="nameAsset"
          name="nameAsset"
          placeholder="Tên tài sản"
          value={nameAsset}
          onChange={(e) => handleChange("nameAsset", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default AssetFilter;
