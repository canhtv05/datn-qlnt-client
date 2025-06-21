
const Policy = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-10 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Chính Sách Bảo Mật</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            1. Mục đích thu thập thông tin
          </h2>
          <p>
            Chúng tôi thu thập thông tin cá nhân để phục vụ cho việc đăng ký, đăng nhập,
            và cải thiện trải nghiệm người dùng.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            2. Phạm vi sử dụng thông tin
          </h2>
          <p>
            Thông tin người dùng được sử dụng trong nội bộ hệ thống để cung cấp dịch vụ,
            hỗ trợ khách hàng và cải thiện nội dung.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            3. Thời gian lưu trữ thông tin
          </h2>
          <p>
            Dữ liệu cá nhân được lưu trữ cho đến khi người dùng yêu cầu xoá, hoặc khi không
            còn cần thiết cho hoạt động dịch vụ.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            4. Cam kết bảo mật thông tin
          </h2>
          <p>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng bằng các phương pháp mã hóa và hệ thống bảo mật.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            5. Liên hệ
          </h2>
          <p>
            Mọi thắc mắc liên quan đến chính sách bảo mật, vui lòng liên hệ qua email:
            <span className="text-green-600 font-medium"> support@example.com</span>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Policy;
