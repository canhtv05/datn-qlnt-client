import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ContractDetailResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { formatDate } from "@/utils/formatTime";

const ContractDetailPage = () => {
  const { contractId } = useParams();
  const [data, setData] = useState<ContractDetailResponse | null>(null);

  useEffect(() => {
    if (contractId) {
      httpRequest
        .get(`/contracts/${contractId}`)
        .then((res) => setData(res.data.data))
        .catch(() => setData(null));
    }
  }, [contractId]);

  if (!data) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu hợp đồng...</div>;

  return (
    <div className="max-w-[800px] mx-auto bg-white text-black p-12 my-12 border border-gray-300 shadow-lg leading-relaxed">
      <h1 className="text-2xl font-bold text-center uppercase mb-6">
        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
        <br />
        <span className="font-normal text-base">Độc lập - Tự do - Hạnh phúc</span>
      </h1>

      <h2 className="text-xl font-semibold text-center underline mb-6">HỢP ĐỒNG THUÊ PHÒNG</h2>

      {/* Thông tin chung */}
      <p className="mb-4">
        <strong>Mã hợp đồng:</strong> {data.contractCode} <br />
        <strong>Ngày tạo:</strong> {formatDate(data.createdAt)} <br />
        <strong>Ngày cập nhật:</strong> {formatDate(data.updatedAt)}
      </p>

      <hr className="my-6 border-dashed" />

      {/* Thông tin bên cho thuê */}
      <h3 className="font-semibold mb-2">BÊN CHO THUÊ (Bên A):</h3>
      <p>
        Họ tên: {data.nameManager} <br />
        Số điện thoại: {data.phoneNumberManager}
      </p>

      <hr className="my-6 border-dashed" />

      {/* Thông tin bên thuê */}
      <h3 className="font-semibold mb-2">BÊN THUÊ (Bên B):</h3>
      <p>
        Họ tên: {data.nameUser} <br />
        Email: {data.emailUser} <br />
        Số điện thoại: {data.phoneNumberUser} <br />
        CCCD: {data.identityCardUser} <br />
        Địa chỉ: {data.addressUser}
      </p>

      <hr className="my-6 border-dashed" />

      {/* Nội dung hợp đồng */}
      <h3 className="font-semibold mb-2">ĐIỀU 1: Thông tin thuê phòng</h3>
      <p>
        Phòng: {data.roomCode} <br />
        Địa chỉ: {data.buildingAddress} <br />
        Giá phòng: {data.roomPrice.toLocaleString()} VNĐ/tháng <br />
        Tiền cọc: {data.deposit.toLocaleString()} VNĐ <br />
        Số người ở: {data.numberOfPeople} <br />
        Ngày bắt đầu: {formatDate(data.startDate)} <br />
        Ngày kết thúc: {formatDate(data.endDate)} <br />
        Trạng thái: {data.status}
      </p>

      <hr className="my-6 border-dashed" />

      {/* Danh sách khách thuê */}
      <h3 className="font-semibold mb-2">ĐIỀU 2: Danh sách khách thuê</h3>
      {data.tenants.length > 0 ? (
        <ol className="list-decimal pl-6">
          {data.tenants.map((t) => (
            <li key={t.id}>
              {t.fullName} - {t.phoneNumber}
            </li>
          ))}
        </ol>
      ) : (
        <p>Không có khách thuê nào.</p>
      )}

      <hr className="my-6 border-dashed" />

      {/* Ký kết */}
      <div className="grid grid-cols-2 gap-8 text-center mt-12">
        <div>
          <p className="font-semibold mb-2">ĐẠI DIỆN BÊN A</p>
          <p>(Ký và ghi rõ họ tên)</p>
        </div>
        <div>
          <p className="font-semibold mb-2">ĐẠI DIỆN BÊN B</p>
          <p>(Ký và ghi rõ họ tên)</p>
        </div>
      </div>

      <p className="text-center text-xs mt-12 italic text-gray-500">Hợp đồng được tạo trên hệ thống quản lý nhà trọ.</p>
    </div>
  );
};

export default ContractDetailPage;
