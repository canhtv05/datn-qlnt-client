import { motion } from "framer-motion";
import { CheckCircle, Users, Home, FileText, BarChart2, Settings, Smartphone, Shield } from "lucide-react";

const features = [
  {
    title: "Quản lý căn hộ",
    desc: "Tạo và quản lý phòng, căn hộ, dự án dễ dàng, linh hoạt theo nhu cầu.",
    icon: <Home className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Quản lý khách thuê",
    desc: "Lưu trữ thông tin, hợp đồng, phương tiện và hỗ trợ ký hợp đồng online.",
    icon: <Users className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Quản lý tài chính",
    desc: "Tự động tạo hóa đơn, theo dõi thu chi, nhắc nợ và thống kê công nợ.",
    icon: <FileText className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Phân quyền nhân viên",
    desc: "Phân quyền theo bộ phận, theo tòa nhà và theo chức năng rõ ràng.",
    icon: <Shield className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Thống kê & báo cáo",
    desc: "Theo dõi hiệu quả kinh doanh qua biểu đồ, bảng biểu trực quan.",
    icon: <BarChart2 className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Cài đặt nâng cao",
    desc: "Tùy chỉnh hợp đồng, hóa đơn, logo, biểu mẫu và xuất dữ liệu dễ dàng.",
    icon: <Settings className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Ứng dụng di động",
    desc: "Hỗ trợ app mobile cho chủ nhà & khách thuê, nhận thông báo dễ dàng.",
    icon: <Smartphone className="w-10 h-10 text-green-600" />,
  },
  {
    title: "Tích hợp & mở rộng",
    desc: "Kết nối IoT, camera, khóa cửa, thanh toán QR và phần mềm kế toán.",
    icon: <CheckCircle className="w-10 h-10 text-green-600" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Tính năng nổi bật</h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Resident cung cấp đầy đủ công cụ để bạn quản lý nhà trọ thông minh, tiện lợi và hiệu quả.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-green-50 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
