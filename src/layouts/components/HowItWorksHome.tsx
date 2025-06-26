import { Link } from "react-router-dom";

import customerImg from "@/assets/svg/img_ready.svg";
import financeImg from "@/assets/svg/feature-finance.svg";
import assetImg from "@/assets/svg/feature-dashboard.svg";
import reportImg from "@/assets/svg/feature-notify.svg";
import MotionFadeLeft from "@/components/ui/MotionFadeLeft";
import MotionFadeRight from "@/components/ui/MotionFadeRight";

const items = [
  {
    title: "Quản lý khách hàng",
    img: customerImg,
    desc: [
      "Lưu trữ hồ sơ thông tin cá nhân của khách hàng một cách chi tiết và chính xác.",
      "Định danh khách thuê bằng số điện thoại, căn cước công dân hoặc hộ chiếu.",
      "Hỗ trợ quản lý khách hàng cá nhân lẫn tổ chức, doanh nghiệp.",
      "Dễ dàng tra cứu khách đã chuyển đi bất cứ lúc nào.",
    ],
  },
  {
    title: "Quản lý tài chính",
    img: financeImg,
    desc: [
      "Theo dõi doanh thu, chi phí, công nợ và dòng tiền hàng tháng.",
      "Tự động tính hóa đơn điện, nước, dịch vụ chính xác cho từng phòng.",
      "Tra cứu lịch sử thanh toán, đối soát và lập báo cáo nhanh chóng.",
    ],
  },
  {
    title: "Quản lý tài sản",
    img: assetImg,
    desc: [
      "Kiểm kê tài sản theo từng phòng: giường, tủ, bàn ghế, thiết bị điện tử,…",
      "Quản lý ngày mua, tình trạng và giá trị tài sản.",
      "Tự động nhắc bảo trì, sửa chữa khi đến hạn.",
    ],
  },
  {
    title: "Báo cáo & thống kê",
    img: reportImg,
    desc: [
      "Biểu đồ doanh thu – chi phí trực quan theo ngày, tuần, tháng.",
      "Thống kê tỷ lệ phòng trống, lịch sử khách thuê.",
      "Giúp chủ trọ nắm bắt tình hình và đưa ra quyết định kịp thời.",
    ],
  },
];

const HowItWorksHome = () => {
  return (
    <section className="bg-gradient-to-b from-white via-green-50 to-white py-20 space-y-28">
      {items.map((item, index) => {
        const isEven = index % 2 === 0;
        const ImageWrapper = isEven ? MotionFadeRight : MotionFadeLeft;
        const ContentWrapper = isEven ? MotionFadeRight : MotionFadeLeft;

        return (
          <div
            key={index}
            className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
          >
            <div className={`${!isEven ? "md:order-2" : ""}`}>
              <ImageWrapper>
                <div className="flex justify-center">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="max-w-full h-auto drop-shadow-md"
                  />
                </div>
              </ImageWrapper>
            </div>
            <div className={`${!isEven ? "md:order-1" : ""}`}>
              <ContentWrapper delay={0.2}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {item.title}
                </h2>
                <ul className="text-gray-700 space-y-3 leading-relaxed mb-6 list-disc list-inside border-l-4 border-green-500 pl-4">
                  {item.desc.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Đăng ký trải nghiệm
                  <span className="ml-1 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
              </ContentWrapper>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default HowItWorksHome;
