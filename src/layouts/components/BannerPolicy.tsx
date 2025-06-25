const PolicyBanner = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-600 to-green-800 py-20 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">
          Chính Sách Bảo Mật
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
          Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn một cách an toàn và minh bạch.
        </p>
      </div>
      <div className="absolute inset-0 opacity-10 bg-[url('/path-to-lock-icon-or-bg.png')] bg-no-repeat bg-center bg-contain pointer-events-none"></div>
    </section>
  );
};

export default PolicyBanner;
