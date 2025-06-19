import { FC, useState } from "react";

import agencyImg from "@/assets/imgs/admin.webp";
import sketchImg from "@/assets/imgs/shadcn.webp";
import candyImg from "@/assets/svg/login-v2.72cd8a26.svg";

const IMAGES = [candyImg, sketchImg, agencyImg];

const Slider: FC = () => {
  const [active, setActive] = useState<number | null>(null);

  const base = [1, 1, 1];
  base[0] = active === null ? 4 : 1;
  if (active !== null) base[active] = 4;

  return (
    <section className="relative bg-gradient-to-r from-gray-100 via-white to-gray-100 py-20">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Các chức năng nổi bật
        </h2>
        <p className="text-gray-600 mt-2">
          Nền tảng toàn diện giúp chủ trọ quản lý dễ dàng và hiệu quả
        </p>
      </div>

      {/* Slider */}
      <div className="flex justify-center items-center">
        <div
          className="grid w-full max-w-[980px] h-[500px] rounded-[3rem] p-8 gap-2 transition-[grid-template-columns] duration-[800ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] shadow-2xl bg-white"
          style={{ gridTemplateColumns: base.map((f) => `${f}fr`).join(" ") }}
        >
          {IMAGES.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <img
                src={src}
                className="w-full h-full object-cover rounded-2xl"
              />
              <a
                href="#"
                className={`absolute bottom-12 right-12 bg-white text-black px-6 py-3 rounded-xl flex items-center gap-2 transition-transform transition-opacity duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
                  active === i ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                Xem chi tiết
                <ArrowRight />
              </a>
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
    width="20"
    height="20"
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
