import { motion } from "framer-motion";
import {
  Home,
  BarChart2,
  Users,
  FileText,
  Bell,
  PenTool,
  Shield,
  ClipboardCheck,
  FilePlus,
} from "lucide-react";

const roleFeatures = [
  {
    role: "Chủ nhà",
    color: "bg-green-50",
    icon: <Home className="w-6 h-6 text-green-600" />,
    items: [
      {
        title: "Xem doanh thu",
        desc: "Theo dõi tổng doanh thu theo tháng, quý, năm bằng biểu đồ trực quan.",
        icon: <BarChart2 className="w-6 h-6 text-green-600" />,
      },
      {
        title: "Tạo phòng / căn hộ",
        desc: "Thêm mới căn hộ, cấu hình tiện ích, mức giá và tình trạng phòng.",
        icon: <FilePlus className="w-6 h-6 text-green-600" />,
      },
      {
        title: "Phân quyền nhân viên",
        desc: "Phân chia quyền hạn truy cập theo chức năng và từng tòa nhà.",
        icon: <Shield className="w-6 h-6 text-green-600" />,
      },
    ],
  },
  {
    role: "Khách thuê",
    color: "bg-blue-50",
    icon: <Users className="w-6 h-6 text-blue-600" />,
    items: [
      {
        title: "Xem hóa đơn",
        desc: "Kiểm tra lịch sử thanh toán, hóa đơn điện, nước, dịch vụ mọi lúc.",
        icon: <FileText className="w-6 h-6 text-blue-600" />,
      },
      {
        title: "Nhận thông báo",
        desc: "Nhận thông báo khi có hóa đơn mới, nhắc hạn thanh toán, hợp đồng.",
        icon: <Bell className="w-6 h-6 text-blue-600" />,
      },
      {
        title: "Ký hợp đồng online",
        desc: "Ký hợp đồng điện tử nhanh chóng, không cần gặp mặt trực tiếp.",
        icon: <PenTool className="w-6 h-6 text-blue-600" />,
      },
    ],
  },
  {
    role: "Kế toán / Nhân viên",
    color: "bg-yellow-50",
    icon: <ClipboardCheck className="w-6 h-6 text-yellow-600" />,
    items: [
      {
        title: "Theo dõi thu chi",
        desc: "Ghi nhận giao dịch, đối soát thu chi và tổng kết hàng tháng.",
        icon: <FileText className="w-6 h-6 text-yellow-600" />,
      },
      {
        title: "In báo cáo",
        desc: "Xuất báo cáo chi tiết định kỳ hoặc theo yêu cầu dưới dạng PDF/Excel.",
        icon: <BarChart2 className="w-6 h-6 text-yellow-600" />,
      },
      {
        title: "Quản lý hợp đồng",
        desc: "Tạo, chỉnh sửa và lưu trữ hợp đồng khách hàng đầy đủ, chính xác.",
        icon: <PenTool className="w-6 h-6 text-yellow-600" />,
      },
    ],
  },
];

const RoleFeatureSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Tính năng theo vai trò người dùng
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roleFeatures.map((group, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ${group.color}`}
            >
              <div className="flex items-center gap-3 mb-4">
                {group.icon}
                <h3 className="text-2xl font-semibold text-gray-800">{group.role}</h3>
              </div>
              <div className="space-y-5 mt-4">
                {group.items.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      {item.icon}
                      <div>
                        <h4 className="font-semibold text-gray-800 text-base">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoleFeatureSection;
