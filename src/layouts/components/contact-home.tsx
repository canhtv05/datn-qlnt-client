import React from "react";

const ContactPage  = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-green-100 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-green-700 mb-4 animate-fade-in">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-600 text-lg">
            Nếu bạn có câu hỏi, góp ý hoặc cần hỗ trợ, hãy gửi thông tin cho chúng tôi bên dưới.
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-10 transition duration-500 hover:shadow-green-200">
          <form className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300 group-hover:ring-1"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                placeholder="example@gmail.com"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-xl p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
                placeholder="Viết nội dung bạn muốn gửi..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-700 hover:scale-[1.02] transition-all duration-300"
            >
              ✉️ Gửi liên hệ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
