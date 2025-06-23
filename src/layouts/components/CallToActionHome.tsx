const CallToAction = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-move-bg z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 animate-fade-in-down">
          Trải nghiệm quản lý nhà trọ ngay hôm nay!
        </h2>
        <p className="text-lg mb-8 text-white/80 animate-fade-in-up">
          Dễ sử dụng – Tiết kiệm thời gian – Tối ưu hóa lợi nhuận cho chủ trọ.
        </p>
        <a
          href="/register"
          className="inline-block bg-white text-blue-900 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-gray-100 transition duration-300 hover:scale-[1.03] animate-pulse"
        >
          ✨ Đăng ký miễn phí
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
