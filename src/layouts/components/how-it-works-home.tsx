import React from "react";

const HowItWorks  = () => {
  const steps = [
    {
      title: "Đăng ký tài khoản",
      desc: "Tạo tài khoản quản lý nhà trọ miễn phí chỉ với vài cú click.",
      icon: "📝",
    },
    {
      title: "Thêm nhà trọ & phòng",
      desc: "Cập nhật thông tin nhà trọ, thêm phòng, thiết lập giá và tiện ích.",
      icon: "🏠",
    },
    {
      title: "Quản lý khách & hóa đơn",
      desc: "Theo dõi hợp đồng, khách thuê, hóa đơn điện nước, tiền cọc,...",
      icon: "📑",
    },
    {
      title: "Xem báo cáo & thống kê",
      desc: "Nắm rõ doanh thu, lịch sử thu chi qua các biểu đồ trực quan.",
      icon: "📊",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Cách sử dụng</h2>
        <p className="text-gray-600 mb-12">
          Làm theo các bước sau để bắt đầu quản lý nhà trọ một cách dễ dàng!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-10 md:gap-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="relative flex flex-col justify-between items-center bg-green-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group w-72 h-[300px]">
                <div className="w-16 h-16 bg-green-700 text-white text-3xl flex items-center justify-center rounded-full mb-4 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-white/90 text-sm text-center">{step.desc}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center">
                  <ArrowRight />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

const ArrowRight = () => (
  <svg
    className="w-10 h-10 text-green-700"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);
