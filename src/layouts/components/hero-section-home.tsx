import React from "react";
import heroImage from "@/assets/imgs/admin.webp"; // Bạn đổi ảnh tùy ý

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white py-24 font-roboto">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between">
        <div className="md:w-1/2 text-center md:text-left mt-12 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug mb-6">
            Quản lý nhà trọ{" "}
            <span className="text-green-600">hiện đại</span>, dễ dàng và hiệu quả
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Theo dõi hợp đồng, hóa đơn, khách thuê và tài sản chỉ với vài cú nhấp – mọi thứ trong tầm tay bạn.
          </p>
          <a
            href="/register"
            className="inline-block bg-green-600 hover:bg-green-400 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition duration-300 ease-in-out"
          >
            Đăng ký miễn phí
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src={heroImage}
            alt="Quản lý nhà trọ"
            className="w-full max-w-md md:max-w-lg rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
