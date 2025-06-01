import { Link } from "react-router-dom";

import { svg } from "@/assets/svg";
import { Button } from "@/components/ui/button";
import RenderIf from "@/components/RenderIf";
import { Viewport } from "@/enums";
import { useLogin } from "./useLogin";
import InputLabel from "@/components/InputLabel";

const Login = () => {
  const { width, handleSubmitForm, value, setValue } = useLogin();

  return (
    <main className="lg:flex w-full h-screen justify-center">
      <RenderIf value={width >= Viewport.LG}>
        <article className="p-5 flex justify-center items-center bg-primary flex-1 float-start w-[70%]">
          <img src={svg.login} alt="img_login" className="object-contain h-[80%]" loading="lazy" />
        </article>
      </RenderIf>
      <aside className="flex justify-center items-center h-full float-end lg:w-[35%] w-full bg-white lg:px-12 py-15 md:px-55 px-15">
        <div className="flex items-center h-full flex-col w-full justify-center">
          <img src={svg.react} alt="logo" className="object-contain w-[100px] h-[100px]" loading="lazy" />
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
            <Link to={``} className="w-full text-right block mt-3 mb-6">
              <span className="text-primary text-[13px]">Quên mật khẩu?</span>
            </Link>

            <Button type="submit" className="w-full" disabled={!value.email.trim() || !value.password.trim()}>
              <span className="text-white">Đăng nhập</span>
            </Button>
          </form>
          <span className="mt-5 text-[14px] text-[#6e6b7b]">
            Bạn chưa có tài khoản?
            <Link to={``} className="ml-2 text-primary">
              Đăng ký miễn phí
            </Link>
          </span>
        </div>
      </aside>
    </main>
  );
};

export default Login;
