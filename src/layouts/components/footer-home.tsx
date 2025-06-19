import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-green-600">Quản Lý Nhà Trọ</h3>
          <p className="text-sm text-gray-600">
            Nền tảng hỗ trợ quản lý nhà trọ toàn diện, giúp bạn theo dõi khách thuê, hóa đơn, hợp đồng và nhiều hơn thế nữa.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Liên kết</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/features">Tính năng</a></li>
            <li><a href="/pricing">Bảng giá</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Liên hệ</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Email: support@qlnhatro.vn</li>
            <li>Hotline: 0123 456 789</li>
            <li>Địa chỉ: Tự tìm</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">Mạng xã hội</h4>
          <div className="flex gap-4 text-gray-600 text-xl">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-tiktok"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} QLNhàTrọ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
