import { ShieldCheck, FileText, Users, Home } from "lucide-react";

const features = [
  {
    icon: <Home className="w-8 h-8 text-purple-600" />,
    title: "Quản lý phòng trọ",
    desc: "Dễ dàng thêm, sửa, và theo dõi từng phòng trong tòa nhà của bạn.",
  },
  {
    icon: <Users className="w-8 h-8 text-purple-600" />,
    title: "Quản lý khách thuê",
    desc: "Theo dõi thông tin, hợp đồng và trạng thái của từng khách thuê.",
  },
  {
    icon: <FileText className="w-8 h-8 text-purple-600" />,
    title: "Hóa đơn tự động",
    desc: "Tạo và gửi hóa đơn hàng tháng một cách nhanh chóng và chính xác.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
    title: "Bảo mật & an toàn",
    desc: "Thông tin của bạn được bảo vệ tuyệt đối với công nghệ hiện đại.",
  },
];

const FeaturesSection  = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Lợi ích nổi bật
        </h2>
        <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Chúng tôi cung cấp những công cụ mạnh mẽ giúp bạn quản lý nhà trọ dễ dàng hơn bao giờ hết.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
