import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useLogin } from "./useLogin";
import InputLabel from "@/components/InputLabel";
import { svg } from "@/assets/svg";
import { FormEvent } from "react";

const Login = () => {
  const { handleSubmitForm, value, setValue, errors, handleLoginWithGoogle } = useLogin();
  const navigate = useNavigate();

  const handleSubmitFormTest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitForm(e);
    navigate("/dashboard");
  }

  return (
    <>
      <h3 className="text-label text-left w-full text-[24px] mt-2">Đăng nhập! 👋</h3>
      <p className="text-label mb-2 text-[14px] text-left w-full mt-2">
        Chào mừng bạn trở lại với TroHub, đăng nhập và tận hưởng
      </p>
      <form className="w-full mt-5" onSubmit={handleSubmitFormTest}>
        <InputLabel
          name="email"
          type="text"
          label="Email:"
          required
          id="email"
          placeholder="abc@xyz.com"
          onChange={(e) => setValue((prev) => ({ ...prev, email: e.target.value }))}
          errorText={errors.email}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="my-3"></div>
        <InputLabel
          name="password"
          type="password"
          label="Mật khẩu:"
          required
          id="pw"
          placeholder="Mật khẩu"
          onChange={(e) => setValue((prev) => ({ ...prev, password: e.target.value }))}
          errorText={errors.password}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="w-full text-right block mt-3 mb-6">
          <Link to={`/forgot-password`}>
            <span className="text-primary text-[13px] hover:text-primary-hover">Quên mật khẩu?</span>
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full hover:shadow-sm"
          disabled={!value.email.trim() || !value.password.trim()}
        >
          <span className="text-white">Đăng nhập</span>
        </Button>
        <div className="relative my-2 flex items-center justify-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#6e6b7b] transform -translate-y-1/2"></div>
          <span className="bg-white text-label px-2 relative z-10 text-[12px]">Hoặc đăng nhập với Google</span>
        </div>

        <Button
          type="button"
          variant={"outline"}
          className="w-full hover:bg-transparent hover:shadow-sm dark:border-border cursor-pointer"
          onClick={handleLoginWithGoogle}
        >
          <img src={svg.googleIcon} alt="logo google" className="size-[20px]" />
          <span className="text-label">Đăng nhập với Google</span>
        </Button>
      </form>
      <span className="mt-5 text-[14px] text-label">
        Bạn chưa có tài khoản?
        <Link to={`/register`} className="ml-2 text-primary hover:text-primary-hover">
          Đăng ký miễn phí
        </Link>
      </span>
    </>
  );
};

export default Login;
