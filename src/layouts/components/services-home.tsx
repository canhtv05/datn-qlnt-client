import React from "react";

const ServicesPage  = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-8">Dịch vụ của chúng tôi</h1>
        <p className="text-gray-600 mb-12">
          Chúng tôi cung cấp các dịch vụ quản lý nhà trọ toàn diện và hiệu quả.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <ServiceCard title="Quản lý phòng trọ" desc="Giúp bạn theo dõi số lượng phòng, khách thuê, tình trạng phòng." />
          <ServiceCard title="Tính tiền điện nước" desc="Tự động tính toán hóa đơn theo chỉ số điện nước." />
          <ServiceCard title="Gửi thông báo" desc="Nhắc nhở thanh toán, hợp đồng, cập nhật kịp thời qua app hoặc SMS." />
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-green-50 p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-xl font-semibold text-green-700 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

export default ServicesPage;
