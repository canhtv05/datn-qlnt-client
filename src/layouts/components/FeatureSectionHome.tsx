import { ShieldCheck, FileText, Users, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";


import MotionFadeUp from "@/components/ui/MotionFadeUp";

const features = [
  {
    icon: <Home className="w-6 h-6 text-green-600 group-hover:text-white transition" />,
    title: "Quản lý phòng trọ",
    desc: "Dễ dàng thêm, sửa và theo dõi từng phòng trong tòa nhà của bạn.",
  },
  {
    icon: <Users className="w-6 h-6 text-green-600 group-hover:text-white transition" />,
    title: "Quản lý khách thuê",
    desc: "Theo dõi thông tin, hợp đồng và trạng thái của từng khách thuê.",
  },
  {
    icon: <FileText className="w-6 h-6 text-green-600 group-hover:text-white transition" />,
    title: "Hóa đơn tự động",
    desc: "Tạo và gửi hóa đơn hàng tháng một cách nhanh chóng và chính xác.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-green-600 group-hover:text-white transition" />,
    title: "Bảo mật & an toàn",
    desc: "Thông tin của bạn được bảo vệ tuyệt đối với công nghệ hiện đại.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <MotionFadeUp>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500">
            Lợi ích nổi bật
          </h2>
          <div className="h-1 w-60 bg-gradient-to-r from-green-400 via-green-500 to-lime-400 rounded-full mx-auto mt-3" />
        </MotionFadeUp>
        <MotionFadeUp delay={0.2}>
          <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto mt-4">
            Công cụ mạnh mẽ giúp bạn quản lý nhà trọ dễ dàng, chính xác và an toàn.
          </p>
        </MotionFadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <MotionFadeUp key={index} delay={index * 0.15}>
              <div className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-green-300 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4 mx-auto transition-all group-hover:bg-green-600">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 mt-6 px-5 py-2.5 text-sm font-semibold rounded-full bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
                >
                  Trải nghiệm ngay
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </MotionFadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
