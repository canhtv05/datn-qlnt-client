import { motion } from "framer-motion";
import { useState } from "react";


import heroImage from "@/assets/imgs/admin.webp";
import { CheckCircle } from "lucide-react";

const HeroSection = () => {
  const [textDone, setTextDone] = useState(false);

  return (
    <section className="bg-gradient-to-br from-[#fff5e0] via-[#fbc888] to-[#f8a769] font-roboto min-h-screen pt-28 relative overflow-hidden z-0">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
        <motion.div
          className={`w-full md:w-1/2 ${
            !textDone
              ? "absolute top-[85%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center"
              : "relative z-10"
          }`}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            x: textDone ? 0 : "-50%",
            y: textDone ? 0 : "-50%",
          }}
          transition={{ duration: 5, ease: "easeInOut" }}
          onAnimationComplete={() => setTextDone(true)}
        >
          <h1 className="text-3xl md:text-4xl font-bold leading-snug text-gray-900 mb-6">
            <span className="text-green-700 font-extrabold">TroHub–</span> Nền tảng hàng đầu <br />
            <span className="text-green-700 font-extrabold">Quản lý nhà trọ cho thuê</span>
          </h1>

          <p className="text-xl text-gray-800 font-medium mb-4">
            Tương lai sẽ là đơn vị sử dụng nhiều nhất Việt Nam
          </p>

          <ul className="space-y-3 text-gray-700 mb-8">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
              Phù hợp với mọi loại hình nhà trọ, căn hộ dịch vụ, văn phòng cho thuê.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
              Quản lý căn hộ 1 cách dễ dàng, đơn giản và hiệu quả.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
              Tự động hóa quy trình quản lý, tiết kiệm thời gian và công sức.
            </li>
          </ul>

          <a
            href="/register"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition duration-300 ease-in-out"
          >
            Dùng thử miễn phí
          </a>
        </motion.div>
        {textDone && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center z-10"
          >
            <img
              src={heroImage}
              alt="Quản lý nhà trọ"
              className="w-full max-w-xl md:max-w-2xl rounded-2xl shadow-xl"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
