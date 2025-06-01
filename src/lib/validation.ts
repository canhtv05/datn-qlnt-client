import { z } from "zod/v4";

/*
  FORGOT PASSWORD
*/
export const emailSchema = z.object({
  email: z.email("Email không hợp lệ"),
});

/*
  FORGOT PASSWORD
*/
export const forgotPassSchema = z
  .object({
    otp: z
      .string()
      .min(4, "OTP phải có 4 chữ số")
      .max(4, "OTP chỉ được 4 chữ số")
      .regex(/^\d{4}$/, "OTP phải là 4 chữ số"),

    password: z
      .string()
      .min(5, "Mật khẩu phải có ít nhất 5 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải chứa chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải chứa chữ in hoa")
      .regex(/\d/, "Mật khẩu phải chứa số")
      .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ký tự đặc biệt"),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm"],
  });

/*
  REGISTER
*/
const isValidFullName = (value: string) => {
  const words = value.trim().split(/\s+/);
  return words.every((word) => word.length >= 2) && words.length > 1;
};

/*
  REGISTER
*/
export const registerSchema = z
  .object({
    email: z.email("Email không hợp lệ"),

    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").refine(isValidFullName, {
      message: "Mỗi từ trong họ tên phải có ít nhất 2 ký tự",
    }),

    phone: z
      .string()
      .min(9, "Số điện thoại phải có ít nhất 9 chữ số")
      .max(15, "Số điện thoại không được vượt quá 15 chữ số")
      .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),

    password: z
      .string()
      .min(5, "Mật khẩu phải có ít nhất 5 ký tự")
      .regex(/[a-z]/, "Mật khẩu phải chứa chữ thường")
      .regex(/[A-Z]/, "Mật khẩu phải chứa chữ in hoa")
      .regex(/\d/, "Mật khẩu phải chứa số")
      .regex(/[^A-Za-z0-9]/, "Mật khẩu phải chứa ký tự đặc biệt"),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm"],
  });

/*
  REGISTER
*/
export const formatFullName = (value: string) => {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
    .join(" ");
};
