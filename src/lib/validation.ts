import { Gender } from "@/enums";
import { z } from "zod/v4";

/*
  CHECK
*/
export const formatFullName = (value: string) => {
  return value
    .trim()
    .split(/\s+/)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
    .join(" ");
};

export const isValidDob = (date: Date) => {
  const today = new Date();
  const age =
    today.getFullYear() -
    date.getFullYear() -
    (today < new Date(date.getFullYear(), date.getMonth(), date.getDate())
      ? 1
      : 0);
  return age >= 18;
};

const isValidFullName = (value: string) => {
  const words = value.trim().split(/\s+/);
  return words.every((word) => word.length >= 1) && words.length > 1;
};

const isValidPhoneNumber = (number: string) => {
  const regex = /^\d+$/;
  return regex.test(number);
};

/* CHECK */

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
      .min(6, "OTP phải có 6 chữ số")
      .max(6, "OTP chỉ được 6 chữ số")
      .regex(/^\d{6}$/, "OTP phải là 6 chữ số"),

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
export const registerSchema = z
  .object({
    email: z.email("Email không hợp lệ"),

    fullName: z
      .string()
      .min(3, "Họ tên phải có ít nhất 3 ký tự")
      .refine(isValidFullName, {
        message: "Mỗi từ trong họ tên phải có ít nhất 3 ký tự",
      }),

    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
      .transform((val) => new Date(val))
      .refine(
        (date) => isValidDob(date),
        "Tuổi của bạn phải lớn hơn hoặc bằng 18"
      ),

    phoneNumber: z
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
    acceptPolicy: z.boolean().refine((val) => val === true, {
      message: "Bạn cần đồng ý với chính sách bảo mật",
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm"],
  });

/*
  UPDATE USER
*/
export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Họ tên phải có ít nhất 3 ký tự")
    .refine(isValidFullName, "Mỗi từ trong họ tên phải có ít nhất 3 ký tự"),

  gender: z.enum(
    [Gender.FEMALE, Gender.MALE, Gender.UNKNOWN],
    "Giới tính không hợp lệ"
  ),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
    .transform((val) => new Date(val))
    .refine(
      (date) => isValidDob(date),
      "Tuổi của bạn phải lớn hơn hoặc bằng 18"
    ),

  phoneNumber: z
    .string()
    .refine(
      (val) => /^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/.test(val),
      "Số điện thoại không hợp lệ, VD: 03xx, 05xx, 07xx, 08xx, 09xx"
    )
    .refine(isValidPhoneNumber, "Số điện thoại chỉ chứa số")
    .min(10, "Số điện thoại ít nhất là 10 số")
    .max(11, "Số điện thoại tối đa là 11 số"),
});
