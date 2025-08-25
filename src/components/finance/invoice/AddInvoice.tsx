import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import TextareaLabel from "@/components/TextareaLabel";
import {
  ApiResponse,
  ContractResponse,
  IdAndName,
  InvoiceBuildingCreationRequest,
  InvoiceCreationRequest,
  InvoiceFloorCreationRequest,
} from "@/types";
import { Dispatch, useMemo } from "react";

interface AddInvoiceForContractProps {
  value: InvoiceCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceCreationRequest>>;
  errors: Partial<Record<keyof InvoiceCreationRequest, string>>;
  type: "contract";
  contractInitToAdd: ApiResponse<ContractResponse[]> | undefined;
}

interface AddInvoiceForBuildingProps {
  value: InvoiceBuildingCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceBuildingCreationRequest>>;
  errors: Partial<Record<keyof InvoiceBuildingCreationRequest, string>>;
  type: "building";
  buildingInitToAdd: ApiResponse<IdAndName[]> | undefined;
}

interface AddInvoiceForFloorProps {
  value: InvoiceFloorCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceFloorCreationRequest>>;
  errors: Partial<Record<keyof InvoiceFloorCreationRequest, string>>;
  type: "floor";
  floorInitToAdd: ApiResponse<IdAndName[]> | undefined;
}

interface AddInvoiceFinalizeProps {
  value: InvoiceCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceCreationRequest>>;
  errors: Partial<Record<keyof InvoiceCreationRequest, string>>;
  type: "finalize";
  contractInitToAdd: ApiResponse<ContractResponse[]> | undefined;
}

type AddInvoiceProps =
  | AddInvoiceForBuildingProps
  | AddInvoiceForContractProps
  | AddInvoiceForFloorProps
  | AddInvoiceFinalizeProps;

const AddInvoice = (props: AddInvoiceProps) => {
  const { value, setValue, errors, type } = props;

  const contractOptions = useMemo(() => {
    if ((type === "contract" || type === "finalize") && "contractInitToAdd" in props) {
      return (
        props.contractInitToAdd?.data?.map((c) => ({
          label: c.contractCode,
          value: c.id,
        })) ?? []
      );
    }
    return [];
  }, [props, type]);

  const buildingOptions = useMemo(() => {
    if (type === "building" && "buildingInitToAdd" in props) {
      return (
        props.buildingInitToAdd?.data?.map((b) => ({
          label: b.name,
          value: b.id,
        })) ?? []
      );
    }
    return [];
  }, [props, type]);

  const floorOptions = useMemo(() => {
    if (type === "floor" && "floorInitToAdd" in props) {
      return (
        props.floorInitToAdd?.data?.map((f) => ({
          label: f.name,
          value: f.id,
        })) ?? []
      );
    }
    return [];
  }, [props, type]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        {(type === "contract" || type === "finalize") && (
          <FieldsSelectLabel
            data={contractOptions}
            placeholder="-- Chọn hợp đồng --"
            label="Hợp đồng:"
            id="contractId"
            name="contractId"
            value={value.contractId ?? ""}
            onChange={(val) => setValue((prev) => ({ ...prev, contractId: val as string }))}
            labelSelect="Hợp đồng"
            showClear
            errorText={errors.contractId}
            required
          />
        )}

        {type === "building" && (
          <FieldsSelectLabel
            data={buildingOptions}
            placeholder="-- Chọn tòa nhà --"
            label="Tòa nhà:"
            id="buildingId"
            name="buildingId"
            value={value.buildingId ?? ""}
            onChange={(val) => setValue((prev) => ({ ...prev, buildingId: val as string }))}
            labelSelect="Tòa nhà"
            showClear
            errorText={errors.buildingId}
            required
          />
        )}

        {type === "floor" && (
          <FieldsSelectLabel
            data={floorOptions}
            placeholder="-- Chọn tầng nhà --"
            label="Tầng nhà:"
            id="floorId"
            name="floorId"
            value={value.floorId ?? ""}
            onChange={(val) => setValue((prev) => ({ ...prev, floorId: val as string }))}
            labelSelect="Tầng nhà"
            showClear
            errorText={errors.floorId}
            required
          />
        )}

        <DatePickerLabel
          date={value?.paymentDueDate ? new Date(value?.paymentDueDate) : undefined}
          setDate={(d) => {
            const date = d.toISOString();
            if (type === "building") {
              setValue((prev) => ({ ...prev, paymentDueDate: date } as InvoiceBuildingCreationRequest));
            } else if (type === "contract") {
              setValue((prev) => ({ ...prev, paymentDueDate: date } as InvoiceCreationRequest));
            } else if (type === "floor") {
              setValue((prev) => ({ ...prev, paymentDueDate: date } as InvoiceFloorCreationRequest));
            } else if (type === "finalize") {
              setValue((prev) => ({ ...prev, paymentDueDate: date } as InvoiceCreationRequest));
            }
          }}
          label="Hạn thanh toán:"
          errorText={errors?.paymentDueDate}
          required
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear()}
        />
      </div>

      <TextareaLabel
        id="note"
        name="note"
        placeholder="Nhập ghi chú"
        label="Ghi chú:"
        value={value.note ?? ""}
        onChange={(e) => {
          const note = e.target.value;

          if (type === "building") {
            setValue((prev) => ({
              ...prev,
              note,
            }));
          } else if (type === "contract") {
            setValue((prev) => ({
              ...prev,
              note,
            }));
          } else if (type === "finalize") {
            setValue((prev) => ({
              ...prev,
              note,
            }));
          } else {
            setValue((prev) => ({
              ...prev,
              note,
            }));
          }
        }}
        errorText={errors.note}
      />
    </div>
  );
};

export default AddInvoice;
