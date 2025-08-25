import { FC, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import p1 from "@/assets/imgs/p1.webp";
import p2 from "@/assets/imgs/p2.webp";
import p3 from "@/assets/imgs/p3.webp";
import p4 from "@/assets/imgs/p4.webp";
import p5 from "@/assets/imgs/p5.webp";

const IMAGES = [p1, p2, p3, p4, p5];

const Slider: FC = () => {
  const [active, setActive] = useState<number | null>(null);

  const base = Array(IMAGES.length).fill(1);
  if (active === null) base[0] = 4;
  else base[active] = 4;

  return (
    <section className="w-full bg-gradient-to-r from-gray-100 via-white to-gray-100 py-20">
      <div className="text-center mb-12 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500"
        >
          Các chức năng nổi bật
        </motion.h2>
        <div className="h-1 w-60 bg-gradient-to-r from-green-400 via-green-500 to-lime-400 rounded-full mx-auto mt-3" />
        <p className="text-gray-600 text-lg max-w-xl mx-auto mt-4">
          Nền tảng giúp chủ trọ quản lý dễ dàng và hiệu quả hơn bao giờ hết.
        </p>
      </div>
      <div className="flex justify-center items-center h-[70vh] px-4">
        <div
          className="grid w-[80vw] h-full rounded-[3rem] gap-2 transition-[grid-template-columns] duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] shadow-2xl bg-white overflow-hidden"
          style={{ gridTemplateColumns: base.map((f) => `${f}fr`).join(" ") }}
        >
          {IMAGES.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer group"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <img
                src={src}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={`Slide ${i}`}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-500" />
              <Link
                to="#"
                className={`absolute bottom-8 right-8 px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md font-semibold text-sm bg-white text-black hover:bg-green-600 hover:text-white transition-all duration-300 ${
                  active === i ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{
                  boxShadow: active === i ? "0 0 14px rgba(34,197,94,0.6)" : undefined,
                }}
              >
                Xem chi tiết
                <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;

const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
