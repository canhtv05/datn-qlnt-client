import { ApiResponse, InvoiceDetailsResponse } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { useEffect } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/ui/StatusBadge";

const InvoiceDetail = () => {
  const { id } = useParams();

  const { data, isError } = useQuery<ApiResponse<InvoiceDetailsResponse>>({
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

  return (
    <div className="space-y-6">
      {/* Thông tin chung */}
      <Card>
        <CardContent className="grid md:grid-cols-2 gap-4 p-6">
          <div>
            <h2 className="font-semibold text-lg mb-2">Thông tin hóa đơn</h2>
            <p>
              <strong>Mã hóa đơn:</strong> {data?.data?.invoiceCode}
            </p>
            <p>
              <strong>Loại hóa đơn:</strong> {data?.data?.invoiceType}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              {data?.data?.invoiceStatus && <StatusBadge status={data.data.invoiceStatus.toString()} />}
            </p>
            <p>
              <strong>Hạn thanh toán:</strong> {data?.data?.paymentDueDate}
            </p>
            <p>
              <strong>Tháng/Năm:</strong> {data?.data?.month}/{data?.data?.year}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-2">Thông tin thuê</h2>
            <p>
              <strong>Tòa nhà:</strong> {data?.data?.buildingName}
            </p>
            <p>
              <strong>Phòng:</strong> {data?.data?.roomCode}
            </p>
            <p>
              <strong>Khách thuê:</strong> {data?.data?.tenantName}
            </p>
            <p>
              <strong>SĐT:</strong> {data?.data?.tenantPhone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bảng chi tiết các khoản */}
      <Card>
        <CardContent className="p-6 overflow-x-auto">
          <h2 className="font-semibold text-lg mb-4">Chi tiết dịch vụ</h2>
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">#</th>
                <th className="border px-4 py-2 text-left">Tên dịch vụ</th>
                <th className="border px-4 py-2 text-right">Đơn giá</th>
                <th className="border px-4 py-2 text-right">Số lượng</th>
                <th className="border px-4 py-2 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.items.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.serviceName}</td>
                  <td className="border px-4 py-2 text-right">{item.unitPrice.toLocaleString()} đ</td>
                  <td className="border px-4 py-2 text-right">{item.quantity}</td>
                  <td className="border px-4 py-2 text-right">{item.amount.toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tổng kết */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <p>
            <strong>Ghi chú:</strong> {data?.data?.note || "Không có"}
          </p>
          <p>
            <strong>Tổng tiền:</strong>{" "}
            <span className="text-emerald-600 font-semibold">{data?.data?.totalAmount.toLocaleString()} đ</span>
          </p>
          <p className="text-sm text-gray-500">
            Ngày tạo: {new Date(data?.data?.createdAt).toLocaleString()} | Cập nhật:{" "}
            {new Date(data?.data?.updatedAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
