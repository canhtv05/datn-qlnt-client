import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import InputLabel from "@/components/InputLabel";
import { useRegister } from "./useRegister";
import { svg } from "@/assets/svg";
import DatePickerLabel from "@/components/DatePickerLabel";

const Register = () => {
  const { handleSubmitForm, value, errors, handleBlur, handleChange, setValue, handleLoginWithGoogle } = useRegister();

  return (
    <>
      <h3 className="text-label text-left w-full text-[24px] mt-2">Đăng ký tài khoản 🚀</h3>
      <p className="text-label mb-2 text-[14px] text-left w-full mt-2">Đăng ký để sử dụng dịch vụ</p>

      <form className="w-full mt-5" onSubmit={handleSubmitForm}>
        <InputLabel
          name="fullName"
          type="text"
          label="Họ tên:"
          required
          id="fullName"
          placeholder="Nguyễn Văn A"
          value={value.fullName}
          onBlur={handleBlur}
          errorText={errors.fullName}
          onChange={handleChange}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="my-3"></div>

        <InputLabel
          name="email"
          type="text"
          label="Email:"
          required
          id="email"
          placeholder="abc@xyz.com"
          value={value.email}
          errorText={errors.email}
          onChange={handleChange}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="my-3"></div>

        <InputLabel
          name="phone"
          type="text"
          label="Số điện thoại:"
          id="phone"
          placeholder="0987654321"
          value={value.phone}
          errorText={errors.phone}
          onChange={handleChange}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="my-3"></div>

        <DatePickerLabel
          date={value?.dob ? new Date(value?.dob) : new Date()}
          setDate={(d) => setValue((prev) => ({ ...prev, dob: d.toISOString() }))}
          label="Ngày sinh:"
          errorText={errors.dob}
        />

        <div className="my-3"></div>
        <InputLabel
          name="password"
          type="password"
          label="Mật khẩu:"
          required
          id="pw"
          placeholder="Mật khẩu"
          value={value.password}
          errorText={errors.password}
          onChange={handleChange}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="my-3"></div>

        <InputLabel
          name="confirm"
          type="password"
          label="Nhập lại mật khẩu:"
          required
          id="confirm"
          placeholder="Xác nhận mật khẩu"
          value={value.confirm}
          errorText={errors.confirm}
          onChange={handleChange}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />

        <div className="w-full text-right block mt-3 mb-6">
          <Link to={`/forgot-password`}>
            <span className="text-primary text-[13px] hover:text-primary-hover">Quên mật khẩu?</span>
          </Link>
        </div>

        <Button type="submit" className="w-full hover:shadow-sm">
          <span className="text-white">Đăng ký</span>
        </Button>
        <div className="relative my-2 flex items-center justify-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#6e6b7b] transform -translate-y-1/2"></div>
          <span className="bg-white text-label px-2 relative z-10 text-[12px]">Hoặc đăng ký với Google</span>
        </div>

        <Button
          type="submit"
          variant={"outline"}
          className="w-full hover:bg-transparent hover:shadow-sm dark:border-border cursor-pointer"
          onClick={handleLoginWithGoogle}
        >
          <img src={svg.googleIcon} alt="logo google" className="size-[20px]" />
          <span className="text-label">Đăng ký với Google</span>
        </Button>
      </form>

      <span className="mt-5 text-[14px] text-label">
        Bạn đã có tài khoản?
        <Link to={`/login`} className="ml-2 text-primary hover:text-primary-hover">
          Đăng nhập
        </Link>
      </span>
    </>
  );
};

export default Register;
