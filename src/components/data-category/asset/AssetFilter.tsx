import ButtonFilter from "@/components/ButtonFilter";
import InputLabel from "@/components/InputLabel";
import { Dispatch, FormEvent, SetStateAction } from "react";

export interface AssetFilterProps {
  filterValues: {
    nameAsset: string;
  };
  setFilterValues: Dispatch<SetStateAction<{ nameAsset: string }>>;
  onClear: () => void;
  onFilter: () => void;
}

const AssetFilter = ({ props }: { props: AssetFilterProps }) => {
  const { nameAsset } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof { nameAsset: string }, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-5 w-full items-end">
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
