import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import InputLabel from "@/components/InputLabel";
import { useRegister } from "./useRegister";
// import { svg } from "@/assets/svg";
import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import { Checkbox } from "@/components/ui/checkbox";
import { GENDER_OPTIONS } from "@/constant";
import { useTranslation } from "react-i18next";

const Register = () => {
  const {
    handleSubmitForm,
    value,
    errors,
    handleBlur,
    handleChange,
    setValue,
    // handleLoginWithGoogle,
    handleCheckboxChange,
  } = useRegister();
  const { t } = useTranslation();
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
          name="phoneNumber"
          type="text"
          label="Số điện thoại:"
          id="phone"
          placeholder="0987654321"
          value={value.phoneNumber}
          errorText={errors.phoneNumber}
          onChange={handleChange}
          className="placeholder:text-[#6e6b7b] text-[#6e6b7b] dark:text-[#6e6b7b] border-border"
        />
        <div className="my-3"></div>

        <DatePickerLabel
          date={value.dob ? new Date(value.dob) : new Date()}
          setDate={(date) =>
            setValue((prev) => ({
              ...prev,
              dob: date.toISOString(),
            }))
          }
          label="Ngày sinh:"
          errorText={errors.dob}
          fromYear={1950}
          toYear={new Date().getFullYear()}
        />
        <div className="my-3"></div>
        <FieldsSelectLabel
          id="gender"
          placeholder="Giới tính"
          label="Giới tính:"
          labelSelect="Giới tính"
          data={GENDER_OPTIONS(t)}
          value={value?.gender ?? ""}
          onChange={(val) =>
            setValue((prev) => ({
              ...prev,
              gender: val as string,
            }))
          }
        />
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}

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
        <div className="flex items-start gap-2 mt-4">
          <Checkbox
            id="acceptPolicy"
            name="acceptPolicy"
            checked={value.acceptPolicy}
            onCheckedChange={(checked) => handleCheckboxChange("acceptPolicy", checked === true)}
          />

          <label htmlFor="acceptPolicy" className="text-gray-700 text-sm">
            Tôi đồng ý với{" "}
            <Link to="/policy" className="text-green-700 underline">
              chính sách bảo mật
            </Link>
          </label>
        </div>
        {errors.acceptPolicy && <p className="text-red-500 text-[12px] font-light mb-3">{errors.acceptPolicy}</p>}
        <div className="w-full text-right block mt-3 mb-6">
          <Link to={`/forgot-password`}>
            <span className="text-primary text-[13px] hover:text-primary-hover">Quên mật khẩu?</span>
          </Link>
        </div>

        <Button type="submit" className="w-full hover:shadow-sm">
          <span className="text-white">Đăng ký</span>
        </Button>
        {/* <div className="relative my-2 flex items-center justify-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#6e6b7b] transform -translate-y-1/2"></div>
          <span className="bg-white text-label px-2 relative z-10 text-[12px]">Hoặc đăng ký với Google</span>
        </div> */}

        {/* <Button
          type="button"
          variant={"outline"}
          className="w-full hover:bg-transparent hover:shadow-sm dark:border-border cursor-pointer"
          onClick={handleLoginWithGoogle}
        >
          <img src={svg.googleIcon} alt="logo google" className="size-[20px]" />
          <span className="text-label">Đăng ký với Google</span>
        </Button> */}
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
