import { motion } from "framer-motion";

const Policy = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800 min-h-screen py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg"
      >
        <h1 className="text-4xl font-extrabold text-green-700 mb-6 border-b pb-3">Chính Sách Bảo Mật</h1>

        <section className="mb-8 border-l-4 border-green-600 pl-5">
          <h2 className="text-xl font-semibold text-green-800 mb-2">1. Mục đích thu thập thông tin</h2>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi thu thập thông tin cá nhân nhằm phục vụ cho việc đăng ký, đăng nhập và nâng cao trải nghiệm người
            dùng trong quá trình sử dụng hệ thống.
          </p>
        </section>

        <section className="mb-8 border-l-4 border-green-600 pl-5">
          <h2 className="text-xl font-semibold text-green-800 mb-2">2. Phạm vi sử dụng thông tin</h2>
          <p className="text-gray-700 leading-relaxed">
            Dữ liệu cá nhân được sử dụng trong nội bộ để cung cấp dịch vụ, hỗ trợ kỹ thuật, cải tiến tính năng và đảm
            bảo tính bảo mật cho người dùng.
          </p>
        </section>
        <section className="mb-8 border-l-4 border-green-600 pl-5">
          <h2 className="text-xl font-semibold text-green-800 mb-2">3. Thời gian lưu trữ thông tin</h2>
          <p className="text-gray-700 leading-relaxed">
            Thông tin sẽ được lưu trữ cho đến khi người dùng yêu cầu xoá, hoặc khi hệ thống không còn cần thiết phục vụ
            cho mục đích cung cấp dịch vụ.
          </p>
        </section>

        <section className="mb-8 border-l-4 border-green-600 pl-5">
          <h2 className="text-xl font-semibold text-green-800 mb-2">4. Cam kết bảo mật thông tin</h2>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi sử dụng các biện pháp bảo mật tiên tiến như mã hóa dữ liệu, xác thực đa lớp và kiểm soát truy cập
            nghiêm ngặt để đảm bảo an toàn cho dữ liệu người dùng.
          </p>
        </section>

        <section className="mb-2 border-l-4 border-green-600 pl-5">
          <h2 className="text-xl font-semibold text-green-800 mb-2">5. Liên hệ</h2>
          <p className="text-gray-700 leading-relaxed">
            Nếu bạn có bất kỳ thắc mắc nào liên quan đến chính sách bảo mật, vui lòng liên hệ:
          </p>
          <p className="mt-2 text-green-700 font-medium text-base">📧 trohub88@gmail.com</p>
          <p className="text-green-700 font-medium text-base">📞 0981635840</p>
        </section>
      </motion.div>
    </div>
  );
};

export default Policy;
