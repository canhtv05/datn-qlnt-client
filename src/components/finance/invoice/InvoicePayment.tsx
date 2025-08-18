import { PaymentMethod } from "@/enums";
import { formattedCurrency } from "@/lib/utils";
import useViewInvoiceDetail from "@/pages/finance/invoice/invoice-detail/useViewInvoiceDetail";
import { CircleAlert } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const InvoicePayment = () => {
  const [searchParams] = useSearchParams();
  const METHOD = searchParams.get("method") ?? "";

  const isValidMethod = Object.values(PaymentMethod).includes(METHOD as PaymentMethod);

  const { data } = useViewInvoiceDetail();

  if (!METHOD || !isValidMethod)
    return <div className="px-4 py-2 bg-background rounded-sm">Phương thức thanh toán không hợp lệ</div>;
  return (
    <div className="px-4 py-2 bg-background rounded-sm">
      <div className="flex flex-col">
        <span className="border-b block w-full p-2 font-bold">Thanh toán bằng chuyển khoản</span>
        <span className="border-b block w-full p-2 font-bold">
          Tổng tiền: {formattedCurrency(data?.data.totalAmount || 0)}
        </span>
        <div className="flex lg:flex-row flex-col lg:items-start items-center">
          <img
            src={`https://img.vietqr.io/image/tpbank-00003837132-compact2.jpg?amount=${
              data?.data?.totalAmount
            }&addInfo=${`${METHOD} - ${data?.data?.note}`}&accountName=Tran%20Van%20Canh`}
            alt="qr code"
            className="bg-cover size-100 p-2 mt-2"
          />
          <div className="flex flex-col lg:mt-17 mt-0">
            <span className="font-bold">Thực hiện theo hướng dẫn sau để thanh toán:</span>
            <div className="space-y-1 m-3 flex flex-col">
              <span className="font-bold">
                Bước 1:{" "}
                <span className="font-normal text-sm">
                  Mở ứng dụng <strong>Mobile Banking</strong> của ngân hàng
                </span>
              </span>
              <span className="font-bold">
                Bước 2:{" "}
                <span className="font-normal text-sm">
                  Chọn <strong>"Thanh toán"</strong> và quét mã QR tại hướng dẫn này
                </span>
              </span>
              <span className="font-bold">
                Bước 3:{" "}
                <span className="font-normal text-sm">
                  Nhập số tiền cần chuyển là{" "}
                  <span className="text-primary">{formattedCurrency(data?.data.totalAmount || 0)}</span> và nội dụng
                  chuyển tiền{" "}
                  <span className="text-primary">
                    {METHOD} - {data?.data?.note}
                  </span>
                  <div>
                    Tên: <span className="uppercase italic font-bold">TRAN VAN CANH</span>
                  </div>
                  <div>
                    Số tài khoản: <span className="font-bold">00003837132</span>
                  </div>
                </span>
                <span className="font-bold">
                  Bước 4:{" "}
                  <span className="font-normal text-sm">
                    Hoàn thành các bước thanh toán theo hướng dẫn và đợi chủ nhà xử lý
                  </span>
                </span>
              </span>
            </div>
            <div className="bg-red-200 items-start rounded-sm p-4 flex gap-2">
              <CircleAlert className="stroke-red-500 lg:size-auto size-10" />
              <span className="text-sm">
                Mã QR chỉ cung cấp cho thanh toán lần này, vui lòng không sao lưu sử dụng cho những lần thanh toán sau.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePayment;
