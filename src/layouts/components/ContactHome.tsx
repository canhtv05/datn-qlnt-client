import { MapPin, Building, Phone, Mail } from "lucide-react";

const ContactInfoSection = () => {
  return (
    <section className="bg-gradient-to-tr from-blue-500 to-blue-700 text-white py-16 pt-24">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">THÔNG TIN LIÊN HỆ</h1>
      </div>
    </section>
  );
};

const ContactContentSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-green-700 text-2xl font-bold mb-4">LIÊN HỆ VÀ HỖ TRỢ</h2>
          <p className="text-gray-700 mb-6">
            Chúng tôi có thể trả lời bất kỳ câu hỏi nào của bạn, cung cấp các bản demo sản phẩm và giúp bạn tìm ra gói
            giải pháp phù hợp.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Trụ sở</h3>
                <p className="text-gray-600">
                  Nhà liền kề 05 – TT2, Khu đô thị Kim Văn Kim Lũ, Đại Kim, Hoàng Mai, Hà Nội.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Building className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Văn phòng</h3>
                <p className="text-gray-600">BT12 Khu nhà ở Mễ Trì, số 2 Đỗ Đức Dục, Mễ Trì, Nam Từ Liêm, Hà Nội.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Số điện thoại</h3>
                <p className="text-gray-600">0981635840</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-800">Email hỗ trợ</h3>
                <p className="text-gray-600">trohub88@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full border border-green-100 hover:shadow-green-200 transition-all duration-500">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 hover:border-green-400"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 hover:border-green-400"
                placeholder="example@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 placeholder-gray-400 hover:border-green-400 resize-none"
                placeholder="Viết nội dung bạn muốn gửi..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-700 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              ✉️ Gửi liên hệ
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const ContactPage = () => {
  return (
    <>
      <ContactInfoSection />
      <ContactContentSection />
    </>
  );
};

export default ContactPage;
