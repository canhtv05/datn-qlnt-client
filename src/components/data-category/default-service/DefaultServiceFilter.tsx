import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { AssetGroup } from "@/enums";
import { AssetTypeFilterValues } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface AssetTypeFilterProps {
  filterValues: AssetTypeFilterValues;
  setFilterValues: Dispatch<SetStateAction<AssetTypeFilterValues>>;
  onClear: () => void;
  onFilter: () => void;
}

const DefaultServiceFilter = ({ props }: { props: AssetTypeFilterProps }) => {
  const { assetGroup, nameAssetType } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof AssetTypeFilterValues, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Nhóm tài sản --"
          labelSelect="Nhóm tài sản"
          data={[
            { label: "Cá nhân", value: AssetGroup.CA_NHAN },
            { label: "Đồ điện", value: AssetGroup.DIEN },
            { label: "Gia dụng", value: AssetGroup.GIA_DUNG },
            { label: "Nội thất", value: AssetGroup.NOI_THAT },
            { label: "Khác", value: AssetGroup.KHAC },
          ]}
          value={assetGroup}
          onChange={(value) => handleChange("assetGroup", String(value))}
          name="assetGroup"
          showClear
        />
        <InputLabel
          type="text"
          id="nameAssetType"
          name="nameAssetType"
          placeholder="Tên loại tài sản"
          value={nameAssetType}
          onChange={(e) => handleChange("nameAssetType", e.target.value)}
        />
      </div>
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default DefaultServiceFilter;
