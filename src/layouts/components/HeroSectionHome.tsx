import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/imgs/anhBannerHome.png";
import Logo from "@/components/Logo";
import MotionFadeLeft from "@/components/ui/MotionFadeLeft";
import MotionFadeRight from "@/components/ui/MotionFadeRight";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-[#fff5e0] via-[#fbc888] to-[#f8a769] font-roboto min-h-screen pt-28 relative overflow-hidden z-0">
      <div className="container mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2 relative z-10">
          <MotionFadeLeft delay={0.1}>
            <h1 className="text-[28px] md:text-[40px] font-bold leading-tight text-gray-900 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <Logo className="text-[36px]" />
                <span className="text-green-700 font-extrabold text-[28px] md:text-[32px]">– Nền tảng hàng đầu</span>
              </div>
              <div className="mt-2 text-green-700 font-extrabold text-[28px] md:text-[32px]">
                Quản lý nhà trọ cho thuê
              </div>
            </h1>
          </MotionFadeLeft>
          <MotionFadeLeft delay={0.2}>
            <p className="text-xl text-gray-800 font-medium mb-4">Tương lai sẽ là đơn vị sử dụng nhiều nhất Việt Nam</p>
          </MotionFadeLeft>

          <ul className="space-y-3 text-gray-700 mb-8 text-left">
            {[
              "Phù hợp với mọi loại hình nhà trọ, căn hộ dịch vụ, văn phòng cho thuê.",
              "Quản lý căn hộ 1 cách dễ dàng, đơn giản và hiệu quả.",
              "Tự động hóa quy trình quản lý, tiết kiệm thời gian và công sức.",
            ].map((text, i) => (
              <MotionFadeLeft key={i} delay={0.3 + i * 0.1}>
                <li className="flex items-start gap-2 max-w-md">
                  <CheckCircle className="text-green-600 w-5 h-5 mt-1 shrink-0" />
                  <span>{text}</span>
                </li>
              </MotionFadeLeft>
            ))}
          </ul>

          <MotionFadeLeft delay={0.6}>
            <Link
              to="/register"
              className="relative inline-block bg-orange-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out group overflow-hidden"
            >
              <span className="relative z-10">Dùng thử miễn phí</span>
              <span className="absolute left-[-75%] top-0 w-full h-full bg-white opacity-10 transform skew-x-[-30deg] group-hover:translate-x-[200%] transition-transform duration-500 ease-in-out"></span>
            </Link>
          </MotionFadeLeft>
        </div>
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center z-10 mb-10">
          <MotionFadeRight delay={0.4}>
            <img src={heroImage} alt="Quản lý nhà trọ" className="w-full max-w-xl md:max-w-2xl rounded-2xl shadow-xl" />
          </MotionFadeRight>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
