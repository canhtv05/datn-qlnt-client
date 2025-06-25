import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-3xl rounded-full animate-aurora-slow" />
        <div className="absolute -bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500 via-green-400 to-teal-300 opacity-20 blur-2xl rounded-full animate-aurora-medium" />
        <div className="absolute top-1/2 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-pink-400 via-yellow-300 to-orange-400 opacity-20 blur-2xl rounded-full animate-aurora-fast" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4 animate-fade-in-down drop-shadow-md">
          Trải nghiệm quản lý nhà trọ ngay!
        </h2>
        <p className="text-lg mb-8 text-white/80 animate-fade-in-up">
          Dễ sử dụng – Tiết kiệm thời gian – Tối ưu hóa lợi nhuận cho chủ trọ.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 text-blue-900 font-semibold bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          ✨ Đăng ký miễn phí
          <svg
            className="w-4 h-4 animate-bounce"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a1 1 0 011 1v12.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 15.586V3a1 1 0 011-1z" />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
