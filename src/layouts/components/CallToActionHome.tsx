
const CallToAction  = () => {
  return (
    <section className="bg-blue-900 py-20 text-white text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4">
          Trải nghiệm quản lý nhà trọ ngay hôm nay!
        </h2>
        <p className="text-lg mb-8">
          Dễ sử dụng – Tiết kiệm thời gian – Tối ưu hóa lợi nhuận cho chủ trọ.
        </p>
        <a
          href="/register"
          className="inline-block bg-white text-blue-900 font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-gray-100 transition duration-300 animate-pulse"
        >
          Đăng ký miễn phí
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
