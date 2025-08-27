import { PaymentMethod } from "@/enums";
import { formattedCurrency } from "@/lib/utils";
import useViewInvoiceDetail from "@/pages/finance/invoice/invoice-detail/useViewInvoiceDetail";
import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const InvoicePayment = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const METHOD = searchParams.get("method") ?? "";

  const isValidMethod = Object.values(PaymentMethod).includes(METHOD as PaymentMethod);

  const { data } = useViewInvoiceDetail();

  if (!METHOD || !isValidMethod)
    return (
      <div className="px-4 py-2 bg-background rounded-sm">
        {" "}
        {t("invoice.payment.invalidMethod")}
      </div>
    );
  return (
    <div className="px-4 py-2 bg-background rounded-sm">
      <div className="flex flex-col">
        <span className="border-b block w-full p-2 font-bold"> {t("invoice.payment.title")} </span>
        <span className="border-b block w-full p-2 font-bold">
          {t("invoice.payment.totalAmount")}: {formattedCurrency(data?.data.totalAmount || 0)}
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
            <span className="font-bold"> {t("invoice.payment.guideTitle")}</span>
            <div className="space-y-1 m-3 flex flex-col">
              <span className="font-bold">
                {t("invoice.payment.step1.title")}{" "}
                <span className="font-normal text-sm">{t("invoice.payment.step1.desc")}</span>
              </span>
              <span className="font-bold">
                {t("invoice.payment.step2.title")}{" "}
                <span className="font-normal text-sm">{t("invoice.payment.step2.desc")}</span>{" "}
              </span>

              <span className="font-bold">
                <span className="font-bold">
                  {t("invoice.payment.step3.title")}{" "}
                  <span className="font-normal text-sm">
                    {t("invoice.payment.step3.desc", {
                      amount: formattedCurrency(data?.data.totalAmount || 0),
                      method: METHOD,
                      note: data?.data?.note,
                    })}
                    <div>
                      {t("invoice.payment.accountName")}:{" "}
                      <span className="uppercase italic font-bold">TRAN VAN CANH</span>
                    </div>
                    <div>
                      {t("invoice.payment.accountNumber")}:{" "}
                      <span className="font-bold">00003837132</span>
                    </div>
                  </span>
                </span>
                <span className="font-bold">
                  {t("invoice.payment.step4.title")}{" "}
                  <span className="font-normal text-sm">{t("invoice.payment.step4.desc")}</span>
                </span>
              </span>
            </div>
            <div className="bg-red-200 items-start rounded-sm p-4 flex gap-2">
              <CircleAlert className="stroke-red-500 lg:size-auto size-10" />
              <span className="text-sm">{t("invoice.payment.warning")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePayment;
