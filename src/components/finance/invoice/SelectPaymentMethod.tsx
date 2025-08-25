import images from "@/assets/imgs";
import { PaymentMethod } from "@/enums";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface SelectPaymentMethodProps {
  selectPaymentMethod: PaymentMethod | string;
  setSelectPaymentMethod: Dispatch<SetStateAction<PaymentMethod | string>>;
}

interface SelectPaymentMethod {
  label: string;
  value: PaymentMethod;
  image: string;
  image2?: string;
}

const paymentMethods: SelectPaymentMethod[] = [
  {
    label: "Ứng dụng quét mã",
    value: PaymentMethod.CHUYEN_KHOAN,
    image: images.vnpayScan,
    image2: images.vnpayQR,
  },
  {
    label: "Tiền mặt",
    value: PaymentMethod.TIEN_MAT,
    image: images.paymentCash,
  },
  {
    label: "Thanh toán qua VNPAY",
    value: PaymentMethod.VNPAY,
    image: images.vnpay,
  },
  // {
  //   label: "Thanh toán qua MOMO",
  //   value: PaymentMethod.MOMO,
  //   image: images.momo,
  // },
  // {
  //   label: "Thanh toán qua ZALOPAY",
  //   value: PaymentMethod.ZALOPAY,
  //   image: images.zalopay,
  // },
];

const SelectPaymentMethod = ({ selectPaymentMethod, setSelectPaymentMethod }: SelectPaymentMethodProps) => {
  return paymentMethods.map((p, idx) => (
    <div
      className={cn(
        "py-3 my-2 rounded-sm border cursor-pointer hover:shadow-lg transition-all",
        selectPaymentMethod === p.value && "bg-primary"
      )}
      key={idx}
      onClick={() => setSelectPaymentMethod(p.value)}
    >
      <div className="flex px-5 gap-7">
        <img src={p.image} alt="img payment method" className="size-10" />
        <div className="flex items-center gap-3">
          <span className={`${selectPaymentMethod === p.value ? "text-white" : "text-primary"}`}>{p.label}</span>
          {p.image2 && <img src={p.image2} alt="img payment method" className="size-10" />}
        </div>
      </div>
    </div>
  ));
};

export default SelectPaymentMethod;
