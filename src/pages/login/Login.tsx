import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLogin } from "./useLogin";
import InputLabel from "@/components/InputLabel";

const Login = () => {
  const { handleSubmitForm, value, setValue } = useLogin();

  return (
    <>
      <h3 className="text-[#6e6b7b] text-left w-full text-[24px] mt-2">Đăng nhập! 👋</h3>
      <p className="text-[#6e6b7b] mb-2 text-[14px] text-left w-full mt-2">
        Bất động sản, tài chính, khách hàng... và hơn thế nữa
      </p>
      <form className="w-full mt-5" onSubmit={(e) => handleSubmitForm(e)}>
        <InputLabel
          type="text"
          label="Email:"
          required
          id="email"
          placeholder="abc@xyz.com"
          onChange={(e) => setValue((prev) => ({ ...prev, email: e.target.value }))}
        />
        <div className="my-3"></div>
        <InputLabel
          type="password"
          label="Mật khẩu:"
          required
          id="pw"
          placeholder="Mật khẩu"
          onChange={(e) => setValue((prev) => ({ ...prev, password: e.target.value }))}
        />
        <div className="w-full text-right block mt-3 mb-6">
          <Link to={`/forgot-password`}>
            <span className="text-primary text-[13px] hover:text-primary-hover">Quên mật khẩu?</span>
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={!value.email.trim() || !value.password.trim()}>
          <span className="text-white">Đăng nhập</span>
        </Button>
      </form>
      <span className="mt-5 text-[14px] text-[#6e6b7b]">
        Bạn chưa có tài khoản?
        <Link to={``} className="ml-2 text-primary hover:text-primary-hover">
          Đăng ký miễn phí
        </Link>
      </span>
    </>
  );
};

export default Login;
