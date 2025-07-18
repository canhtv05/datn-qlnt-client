import {
  BuildingType,
  Gender,
  RoomType,
  FloorType,
  RoomStatus,
  AssetGroup,
  AssetBeLongTo,
  VehicleType,
  VehicleStatus,
  ServiceType,
  ServiceAppliedBy,
  ServiceStatus,
  DefaultServiceAppliesTo,
  DefaultServiceStatus,
  ServiceRoomStatus,
  MeterType,
} from "@/enums";
import { z } from "zod/v4";

/*
  CHECK
*/
export const formatFullName = (value: string) => {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
    .join(" ");
};

export const isValidDob = (date: Date) => {
  const today = new Date();
  const age =
    today.getFullYear() -
    date.getFullYear() -
    (today < new Date(date.getFullYear(), date.getMonth(), date.getDate()) ? 1 : 0);
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

const zSafeNumber = (fieldName: string) =>
  z
    .any()
    .transform((val) => {
      // parse value
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        const trimmed = val.trim();
        const parsed = Number(trimmed);
        return isNaN(parsed) ? NaN : parsed;
      }
      return NaN;
    })
    .refine((val) => !isNaN(val), {
      message: `${fieldName} không hợp lệ`,
    })
    .refine((val) => val >= 1, {
      message: `${fieldName} phải ≥ 1`,
    });

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

    fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự").refine(isValidFullName, {
      message: "Mỗi từ trong họ tên phải có ít nhất 3 ký tự",
    }),

    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
      .transform((val) => new Date(val))
      .refine((date) => isValidDob(date), "Tuổi của bạn phải lớn hơn hoặc bằng 18"),

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

  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.UNKNOWN], "Giới tính không hợp lệ"),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
    .transform((val) => new Date(val))
    .refine((date) => isValidDob(date), "Tuổi của bạn phải lớn hơn hoặc bằng 18"),

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

/* BUILDINGS */
export const createOrUpdateBuildingSchema = z
  .object({
    address: z.string().min(1, "Địa chỉ không được để trống"),
    buildingName: z.string().min(1, "Tên tòa nhà không được để trống"),

    actualNumberOfFloors: zSafeNumber("Số tầng thực tế"),
    numberOfFloorsForRent: zSafeNumber("Số tầng cho thuê"),

    buildingType: z.enum(
      [BuildingType.CAN_HO_DICH_VU, BuildingType.CHUNG_CU_MINI, BuildingType.KHAC, BuildingType.NHA_TRO],
      { message: "Loại tòa nhà không hợp lệ" }
    ),

    description: z.string().optional(),
  })
  .refine(
    (data) =>
      typeof data.actualNumberOfFloors === "number" &&
      typeof data.numberOfFloorsForRent === "number" &&
      data.actualNumberOfFloors >= data.numberOfFloorsForRent,
    {
      message: "Số tầng cho thuê không được lớn hơn số tầng thực tế",
      path: ["numberOfFloorsForRent"],
    }
  );

/* FLOOR */
export const createFloorSchema = z.object({
  maximumRoom: zSafeNumber("Số phòng tối đa")
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 99, "Số phòng tối đa từ 1 -> 99"),

  floorType: z.enum([FloorType.CHO_THUE, FloorType.DE_O, FloorType.KHAC, FloorType.KHO, FloorType.KHONG_CHO_THUE], {
    message: "Loại tầng không hợp lệ",
  }),

  descriptionFloor: z.string(),
});

export const updateFloorSchema = createFloorSchema.extend({
  nameFloor: z.string().min(1, "Tên tầng không được để trống"),
});

/* ASSET TYPE */
export const createOrUpdateAssetTypeSchema = z.object({
  nameAssetType: z.string().min(1, "Tên loại tài sản không được để trống"),
  assetGroup: z.enum([AssetGroup.CA_NHAN, AssetGroup.DIEN, AssetGroup.GIA_DUNG, AssetGroup.KHAC, AssetGroup.NOI_THAT], {
    message: "Nhóm tài sản không hợp lệ",
  }),
  discriptionAssetType: z.string().min(1, "Mô tả không được để trống"),
});
/* ROOM */
export const createOrUpdateRoomSchema = z
  .object({
    floorId: z.string().min(1, { message: "Vui lòng chọn tầng" }),

    acreage: zSafeNumber("Diện tích").refine((val) => val >= 1, {
      message: "Diện tích phải ≥ 1",
    }),

    price: z.union([zSafeNumber("Giá"), z.literal(null)]).refine((val) => val === null || val >= 0, {
      message: "Giá phải là số không âm",
    }),

    maximumPeople: z
      .union([zSafeNumber("Số người tối đa"), z.literal(null)])
      .refine((val) => val === null || val >= 1, {
        message: "Số người tối đa phải ≥ 1",
      }),

    roomType: z.enum([RoomType.GHEP, RoomType.DON, RoomType.KHAC], {
      message: "Loại phòng không hợp lệ",
    }),

    status: z.enum(
      [
        RoomStatus.TRONG,
        RoomStatus.CHUA_HOAN_THIEN,
        RoomStatus.DANG_THUE,
        RoomStatus.DA_DAT_COC,
        RoomStatus.DANG_BAO_TRI,
        RoomStatus.HUY_HOAT_DONG,
        RoomStatus.TAM_KHOA,
      ],
      { message: "Trạng thái phòng không hợp lệ" }
    ),

    description: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      typeof data.acreage === "number" && (data.maximumPeople === null || typeof data.maximumPeople === "number"),
    {
      message: "Dữ liệu diện tích hoặc số người tối đa không hợp lệ",
      path: ["maximumPeople"],
    }
  );

/* ASSET */
export const createOrUpdateAssetSchema = z.object({
  nameAsset: z.string().min(1, "Tên tài sản không được để trống"),
  assetTypeId: z.string().min(1, "Vui lòng chọn loại tài sản"),
  assetBeLongTo: z.enum([AssetBeLongTo.CA_NHAN, AssetBeLongTo.CHUNG, AssetBeLongTo.PHONG], {
    message: "Tài sản thuộc về không hợp lệ",
  }),
  roomID: z.string().min(1, "Vui lòng chọn loại phòng"),
  buildingID: z.string().min(1, "Vui lòng chọn tòa nhà"),
  tenantId: z.string().min(1, "Vui lòng chọn khách thuê").optional(),
  descriptionAsset: z.string(),
  price: zSafeNumber("Giá")
    .transform((val) => Number(val))
    .refine((val) => val >= 0.0, "Giá không được âm"),
});

/* TENANT */
export const createOrUpdateTenantSchema = z.object({
  email: z.email("Email không hợp lệ"),

  fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự").refine(isValidFullName, {
    message: "Mỗi từ trong họ tên phải có ít nhất 3 ký tự",
  }),

  dob: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, "Ngày sinh không hợp lệ")
    .transform((val) => new Date(val)),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại phải có ít nhất 9 chữ số")
    .max(15, "Số điện thoại không được vượt quá 15 chữ số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),

  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.UNKNOWN], "Giới tính không hợp lệ"),

  identityCardNumber: z.string().regex(/^\d{12}$/, "Căn cước công dân phải 12 chữ số"),

  address: z.string().min(1, "Địa chỉ không được để trống"),
});

/* VEHICLE */
export const createVehicleSchema = z
  .object({
    tenantId: z.string().min(1, "Vui lòng chọn khách thuê"),
    vehicleType: z.enum([VehicleType.KHAC, VehicleType.O_TO, VehicleType.XE_DAP, VehicleType.XE_MAY], {
      message: "Loại phương tiện không hợp lệ",
    }),
    licensePlate: z.string(),
    vehicleStatus: z.enum([VehicleStatus.TAM_KHOA, VehicleStatus.SU_DUNG], {
      message: "Trạng thái phương tiện không hợp lệ",
    }),
    registrationDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), "Ngày đăng ký không hợp lệ")
      .transform((val) => new Date(val)),
    describe: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.vehicleType === VehicleType.XE_DAP || data.vehicleType === VehicleType.KHAC) {
        return true; // Skip license plate validation for these types
      }
      return data.licensePlate.trim().length > 0;
    },
    {
      message: "Biển số xe không được để trống",
      path: ["licensePlate"],
    }
  );

export const updateVehicleSchema = z.object({
  vehicleStatus: z.enum([VehicleStatus.TAM_KHOA, VehicleStatus.SU_DUNG], {
    message: "Trạng thái phương tiện không hợp lệ",
  }),
  describe: z.string(),
});
/*CONTRACT*/
export const createOrUpdateContractSchema = z
  .object({
    roomId: z.string().min(1, "Vui lòng chọn phòng của bạn"),
    numberOfPeople: z.number({ message: "Số người phải là số" }).min(1, "Phải có ít nhất 1 người"),
    startDate: z.date({ message: "Ngày bắt đầu không hợp lệ" }),
    endDate: z.date({ message: "Ngày kết thúc không hợp lệ" }),
    deposit: z.number({ message: "Tiền cọc phải là số" }).min(1, "Tiền cọc phải lớn hơn 0"),
    tenants: z.array(z.string()).min(1, "Phải có ít nhất một khách thuê"),
  })
  .refine(
    (data) => {
      const { startDate, endDate } = data;
      const minEndDate = new Date(startDate);
      minEndDate.setMonth(minEndDate.getMonth() + 3);
      return endDate >= minEndDate;
    },
    {
      message: "Ngày kết thúc phải cách ngày bắt đầu ít nhất 3 tháng",
      path: ["endDate"],
    }
  );

/* SERVICE */
export const createOrUpdateService = z.object({
  name: z.string().min(1, "Không được để trống tên dịch vụ"),
  type: z.enum([ServiceType.CO_DINH, ServiceType.TINH_THEO_SO], {
    message: "Loại dịch vụ không hợp lệ",
  }),
  unit: z.string().min(1, "Không được để trống đơn vị"),
  price: zSafeNumber("Giá").refine((val) => val >= 0.0, "Giá không được âm"),
  appliedBy: z.enum([ServiceAppliedBy.NGUOI, ServiceAppliedBy.PHONG, ServiceAppliedBy.TANG], {
    message: "Dịch vụ áp dụng không hợp lệ",
  }),
  status: z.enum([ServiceStatus.HOAT_DONG, ServiceStatus.TAM_KHOA, ServiceStatus.KHONG_SU_DUNG], {
    message: "Trạng thái không hợp lệ",
  }),
  description: z.string().optional(),
});

/* DEFAULT SERVICE */
export const updateDefaultServiceSchema = z.object({
  defaultServiceAppliesTo: z.enum([DefaultServiceAppliesTo.HOP_DONG, DefaultServiceAppliesTo.PHONG], {
    message: "Dịch vụ mặc định áp dụng không hợp lệ",
  }),
  pricesApply: zSafeNumber("Giá").refine((val) => val >= 0.0, "Giá không được âm"),
  defaultServiceStatus: z.enum(
    [DefaultServiceStatus.HOAT_DONG, DefaultServiceStatus.TAM_DUNG, DefaultServiceStatus.HUY_BO],
    "Trạng thái dịch vụ mặc định không hợp lệ"
  ),
  description: z.string().optional(),
});

export const creationDefaultServiceSchema = updateDefaultServiceSchema.extend({
  startApplying: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, "Ngày bắt đầu áp dụng không hợp lệ")
    .transform((val) => new Date(val)),
  buildingId: z.string().min(1, "Vui lòng chọn tòa nhà"),
  floorId: z.string().min(1, "Vui lòng chọn tầng"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
});

/* SERVICE ROOM */
export const createServiceRoomSchema = z.object({
  roomId: z.string().min(1, "Vui lòng chọn phòng"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  startDate: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, "Ngày bắt đầu không hợp lệ")
    .transform((val) => new Date(val)),
  totalPrice: zSafeNumber("Giá").refine((val) => val >= 0.0, "Giá không được âm"),

  descriptionServiceRoom: z.string().optional(),
});

export const updateServiceRoomSchema = createServiceRoomSchema.extend({
  serviceRoomStatus: z.enum([ServiceRoomStatus.DANG_SU_DUNG, ServiceRoomStatus.DA_HUY, ServiceRoomStatus.TAM_DUNG], {
    message: "Dịch vụ phòng không hợp lệ",
  }),
});

/* METER */
export const createOrUpdateMeterSchema = z.object({
  roomId: z.string().min(1, "Vui lòng chọn phòng"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
  meterType: z.enum([MeterType.DIEN, MeterType.NUOC], "Loại công tơ không hợp lệ"),
  meterName: z.string().min(1, "Tên công tơ không được để trống"),
  meterCode: z.string().min(1, "Mã công tơ không được để trống"),
  manufactureDate: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, "Ngày sản xuất không hợp lệ")
    .transform((val) => new Date(val))
    .refine((val) => {
      const date = new Date();
      return val <= date;
    }, "Ngày sản xuất không được ở trong tương lai"),
  initialIndex: zSafeNumber("Chỉ số ban đầu").refine((val) => val >= 0.0, "Chỉ số ban đầu không được âm"),
  descriptionMeter: z.string().optional(),
});

/* METER READING */
export const updateMeterReadingSchema = z
  .object({
    oldIndex: zSafeNumber("Chỉ số cũ").refine((val) => val >= 0, "Chỉ số cũ không được âm"),
    newIndex: zSafeNumber("Chỉ số cũ").refine((val) => val >= 0, "Chỉ số mới không được âm"),
    month: zSafeNumber("Tháng").refine((val) => val >= 1 && val <= 12, "Tháng nằm trong 1 - 12"),
    year: zSafeNumber("Năm").refine((val) => val >= 1, "Năm phải >= 1"),
    readingDate: z.string().refine((val) => {
      return !isNaN(Date.parse(val));
    }, "Ngày đọc không hợp lệ"),
    descriptionMeterReading: z.string().optional(),
  })
  .refine(
    (data) => {
      const { newIndex, oldIndex } = data;
      return Number(newIndex) >= Number(oldIndex);
    },
    {
      message: "Chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ",
      path: ["newIndex"],
    }
  );

export const createMeterReadingSchema = updateMeterReadingSchema.extend({
  meterId: z.string().min(1, "Vui lòng chọn công tơ"),
});
