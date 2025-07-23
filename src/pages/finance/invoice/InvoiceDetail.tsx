import { ApiResponse, InvoiceDetailsResponse } from "@/types";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { useEffect } from "react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusBadge from "@/components/ui/StatusBadge";
import readVNNumber from "@oorts/read-vn-number";

const InvoiceDetail = () => {
  const { id } = useParams();

  const { data, isError, isLoading } = useQuery<ApiResponse<InvoiceDetailsResponse>>({
    queryKey: ["invoice-detail"],
    queryFn: async () => {
      const res = await httpRequest.get(`/invoices/${id}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi xem chi tiết hóa đơn");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="w-full text-center">
        <span>Đang tải chi tiết hóa đơn...</span>
      </div>
    );
  }

  const NA = "N/A";

  const formatted = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="p-10 bg-white">
      <header className="mt-10 flex md:flex-row flex-col justify-between items-end">
        <aside className="flex flex-col gap-y-2">
          <Logo tro="text-[26px]" hub="text-[26px]" />
          <span>
            Tên tòa nhà/Building name: <strong>{data?.data?.buildingName}</strong>
          </span>
          <span>
            Phòng/Room: <strong>{data?.data?.roomCode}</strong>
          </span>
          <span>
            Khách hàng/Customer:{" "}
            <strong>
              {data?.data?.tenantName} - {data?.data?.tenantPhone ?? NA}
            </strong>
          </span>
        </aside>
        <article className="flex flex-col gap-y-2 md:mt-0 mt-5 md:items-end items-start">
          <h1 className="uppercase font-black text-end">Hóa đơn/Payment request</h1>
          <span className="text-end">
            Mã/Code: <strong>{data?.data?.invoiceCode}</strong>
          </span>
          <span className="text-end">
            Ngày/Date:{" "}
            <strong>{data?.data?.createdAt && new Date(data?.data?.createdAt).toLocaleDateString("vi-VN")}</strong>
          </span>
          <span className="text-end">
            Hạn TT/Due date:{" "}
            <strong>{data?.data?.paymentDueDate && new Date(data?.data?.createdAt).toLocaleDateString("vi-VN")}</strong>
          </span>
          <span className="flex gap-2 items-center justify-end">
            Loại hóa đơn/Invoice type: {data?.data?.invoiceType && <StatusBadge status={data?.data?.invoiceType} />}
          </span>
          <span className="flex gap-2 items-center justify-end">
            Trạng thái/Status: {data?.data?.invoiceStatus && <StatusBadge status={data?.data?.invoiceStatus} />}
          </span>
        </article>
      </header>
      <main className="mt-10">
        <Table className="border">
          <TableHeader>
            <TableRow className="[&>th]:border-r last:border-r-0 [&>th]:font-black [&>th]:bg-primary [&>th]:text-white [&>th]:text-end">
              <TableHead className="!text-center">STT</TableHead>
              <TableHead className="!text-start">Tên dịch vụ</TableHead>
              <TableHead className="!text-center">Loại dịch vụ</TableHead>
              <TableHead className="!text-center">Dịch vụ tính theo</TableHead>
              <TableHead className="!text-center">Đơn vị</TableHead>
              <TableHead>Chỉ số đầu</TableHead>
              <TableHead>Chỉ số cuối</TableHead>
              <TableHead className="text-right">Số lượng</TableHead>
              <TableHead className="text-right">Đơn giá</TableHead>
              <TableHead className="text-right">Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.items?.map((item, index) => (
              <TableRow key={item.id ?? index} className="[&>td]:border-r last:border-r-0 [&>td]:text-end">
                <TableCell className="!text-center">{index + 1}</TableCell>
                <TableCell className="!text-start">{item.serviceName}</TableCell>
                <TableCell className="!text-center">
                  <StatusBadge status={item.serviceCategory} />
                </TableCell>
                <TableCell className="!text-center">
                  <StatusBadge status={item.serviceCalculation} />
                </TableCell>
                <TableCell className="!text-center">{item.unit ?? NA}</TableCell>
                <TableCell className="text-right">{item.oldIndex ?? NA}</TableCell>
                <TableCell className="text-right">{item.newIndex ?? NA}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatted(item?.unitPrice)}</TableCell>
                <TableCell className="text-right">{formatted(item?.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
      <div className="flex justify-end mt-4 text-sm">
        <div className="text-end">
          <div>
            Thành tiền / Total amount:{" "}
            <strong className="text-red-500 text-base">
              {data?.data?.totalAmount ? formatted(data?.data?.totalAmount) : formatted(0)}
            </strong>
          </div>
          <div className="italic text-xs mt-1 text-gray-600">
            (Bằng chữ:{" "}
            {(() => {
              const text = readVNNumber.toVNWord(9999);
              return text === "" ? "Miễn phí" : text.charAt(0).toUpperCase() + text.slice(1);
            })()}
            )
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start text-sm mt-6">
        <span>
          Hóa đơn / Invoice for:{" "}
          <strong>
            {data?.data?.month ?? NA} - {data?.data?.year ?? NA}
          </strong>
        </span>
        <span className="mt-2">
          <span className="text-red-500 font-medium">Ghi chú / Note:</span> {data?.data?.note || NA}
        </span>
      </div>
    </div>
  );
};

export default InvoiceDetail;
