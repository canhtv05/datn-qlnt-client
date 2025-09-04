import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaChevronRight } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { TbBrandTiktok } from "react-icons/tb";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

import Logo from "@/components/Logo";
import MotionFadeUp from "@/components/ui/MotionFadeUp";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 pt-16">
      <MotionFadeUp>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <MotionFadeUp delay={0.1}>
            <div>
              <Logo className="text-3xl mb-4" />
              <p className="text-base text-gray-700 leading-7 font-bold">
                Nền tảng hỗ trợ quản lý nhà trọ toàn diện, giúp bạn theo dõi khách thuê, hóa đơn, hợp đồng và nhiều hơn
                thế nữa.
              </p>
            </div>
          </MotionFadeUp>
          <MotionFadeUp delay={0.2}>
            <div>
              <h4 className="text-lg font-bold text-green-600 mb-1">Liên hệ</h4>
              <div className="w-16 h-1 bg-green-600 mb-4 rounded"></div>
              <ul className="space-y-3 text-base text-gray-700 font-bold">
                <li className="flex items-center gap-2">
                  <MdEmail className="text-xl text-green-600" />
                  <span>trohub88@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdPhone className="text-xl text-green-600" />
                  <span>0981635840</span>
                </li>
                <li className="flex items-center gap-2">
                  <MdLocationOn className="text-xl text-green-600" />
                  <span>Hà Nội, Việt Nam</span>
                </li>
              </ul>
            </div>
          </MotionFadeUp>
          <MotionFadeUp delay={0.3}>
            <div>
              <h4 className="text-lg font-bold text-green-600 mb-1">Mạng xã hội</h4>
              <div className="w-25 h-1 bg-green-600 mb-4 rounded"></div>
              <div className="flex gap-4 flex-wrap">
                {[
                  {
                    icon: <FaFacebookF />,
                    name: "Facebook",
                    color: "bg-blue-600",
                    link: "https://facebook.com/",
                  },
                  {
                    icon: <SiZalo />,
                    name: "Zalo",
                    color: "bg-[#0068ff]",
                    link: "https://zalo.me/",
                  },
                  {
                    icon: <TbBrandTiktok />,
                    name: "TikTok",
                    color: "bg-black",
                    link: "https://www.tiktok.com/",
                  },
                  {
                    icon: <FaYoutube />,
                    name: "YouTube",
                    color: "bg-red-600",
                    link: "https://www.youtube.com/",
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.name}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${item.color} hover:scale-110 transition-transform shadow-md`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </MotionFadeUp>
          <MotionFadeUp delay={0.4}>
            <div>
              <h4 className="text-lg font-bold text-green-600 mb-1">Liên kết</h4>
              <div className="w-16 h-1 bg-green-600 mb-4 rounded"></div>
              <ul className="space-y-3 text-base font-bold text-gray-700">
                {[
                  { to: "/", label: "Trang chủ" },
                  { to: "/features", label: "Tính năng" },
                  { to: "/services", label: "Dịch vụ" },
                  { to: "/contact", label: "Liên hệ" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaChevronRight className="text-green-600 text-sm" />
                    <Link to={item.to} className="hover:text-green-600 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </MotionFadeUp>
        </div>
      </MotionFadeUp>
      <MotionFadeUp delay={0.5}>
        <div className="mt-10 border-t border-gray-200 pt-4 pb-6 text-sm text-gray-500 text-center px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 max-w-7xl mx-auto">
            <span>
              © {new Date().getFullYear()} <span className="font-bold text-green-600">QLNhàTrọ</span>. All rights
              reserved.
            </span>
            <div className="flex gap-4 font-medium">
              <span className="hover:text-green-600">Điều khoản</span>
              <Link to="/policy" className="hover:text-green-600">
                Chính sách
              </Link>
            </div>
          </div>
        </div>
      </MotionFadeUp>
    </footer>
  );
};

export default Footer;
