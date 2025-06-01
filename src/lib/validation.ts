import { z } from "zod/v4";

export const emailSchema = z.object({
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
});

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
