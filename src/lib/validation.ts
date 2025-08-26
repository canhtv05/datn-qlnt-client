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
  DefaultServiceAppliesTo,
  DefaultServiceStatus,
  ServiceRoomStatus,
  MeterType,
  ServiceCategory,
  ServiceCalculation,
  InvoiceItemType,
  AssetType,
  AssetStatus,
  NotificationType,
} from "@/enums";
import { isNumber } from "lodash";
import { z } from "zod/v4";
import i18next from "i18next";

const t = i18next.t;

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

const zSafeNumber = (fieldName: string, options?: { min?: number; max?: number }) =>
  z.preprocess(
    (val) => {
      if (typeof val === "number") return val;
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "") return undefined;
        const parsed = Number(trimmed);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    },
    z
      .number({ error: t("validation:number.invalid") })
      .refine((val) => !isNaN(val), {
        message: t("validation:number.invalidField", { field: fieldName }),
      })
      .refine((val) => options?.min === undefined || val >= options.min!, {
        message: t("validation:number.min", { field: fieldName, min: options?.min }),
      })
      .refine((val) => options?.max === undefined || val <= options.max!, {
        message: t("validation:number.max", { field: fieldName, max: options?.max }),
      })
  );

/* CHECK */

/*
  FORGOT PASSWORD
*/
export const emailSchema = z.object({
  email: z.email(t("validation:email.invalid")),
});

/*
  FORGOT PASSWORD
*/
export const forgotPassSchema = z
  .object({
    otp: z
      .string()
      .min(6, t("validation:otp.length"))
      .max(6, t("validation:otp.length"))
      .regex(/^\d{6}$/, t("validation:otp.invalid")),

    password: z
      .string()
      .min(5, t("validation:password.min"))
      .regex(/[a-z]/, t("validation:password.lowercase"))
      .regex(/[A-Z]/, t("validation:password.uppercase"))
      .regex(/\d/, t("validation:password.number"))
      .regex(/[^A-Za-z0-9]/, t("validation:password.special")),

    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: t("validation:password.confirmMismatch"),
    path: ["confirm"],
  });

/*
  REGISTER
*/
export const registerSchema = z
  .object({
    email: z.string().email(t("validation:email.invalid")),

    fullName: z
      .string()
      .min(3, t("validation:fullName.min"))
      .refine(isValidFullName, {
        message: t("validation:fullName.wordMin"),
      }),

    dob: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), t("validation:dob.invalid"))
      .transform((val) => new Date(val))
      .refine((date) => isValidDob(date), t("validation:dob.age")),

    phoneNumber: z
      .string()
      .min(9, t("validation:phone.min"))
      .max(15, t("validation:phone.max"))
      .regex(/^[0-9]+$/, t("validation:phone.onlyNumber")),

    password: z
      .string()
      .min(5, t("validation:password.min"))
      .regex(/[a-z]/, t("validation:password.lowercase"))
      .regex(/[A-Z]/, t("validation:password.uppercase"))
      .regex(/\d/, t("validation:password.number"))
      .regex(/[^A-Za-z0-9]/, t("validation:password.special")),

    confirm: z.string(),

    acceptPolicy: z.boolean().refine((val) => val === true, {
      message: t("validation:policy.required"),
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: t("validation:password.confirmMismatch"),
    path: ["confirm"],
  });

/*
  UPDATE USER
*/ export const updateUserSchema = z.object({
  fullName: z.string().min(3, t("validation:fullName.min")).refine(isValidFullName, t("validation:fullName.wordMin")),

  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.UNKNOWN], {
    message: t("validation:gender.invalid"),
  }),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: t("validation:dob.invalid"),
    })
    .transform((val) => new Date(val))
    .refine((date) => isValidDob(date), {
      message: t("validation:dob.age"),
    }),

  phoneNumber: z
    .string()
    .refine((val) => /^(?:\+84|0)(3|5|7|8|9)[0-9]{8}$/.test(val), t("validation:phone.pattern"))
    .refine(isValidPhoneNumber, t("validation:phone.onlyNumber"))
    .min(10, t("validation:phone.min"))
    .max(11, t("validation:phone.max")),
});

/* BUILDINGS */
export const createOrUpdateBuildingSchema = z
  .object({
    address: z.string().min(1, "Địa chỉ không được để trống"),
    buildingName: z.string().min(1, "Tên tòa nhà không được để trống"),

    actualNumberOfFloors: zSafeNumber("Số tầng thực tế", { min: 1 }),
    numberOfFloorsForRent: zSafeNumber("Số tầng cho thuê", { min: 1 }),

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
  maximumRoom: zSafeNumber("Số phòng tối đa", { min: 1 })
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

/* ROOM ASSET */
export const roomAssetFormSchema = z
  .object({
    assetBeLongTo: z.string().min(1, { message: "Trường 'Thuộc về' không được để trống" }),
    roomId: z.string().min(1, { message: "Phòng không được để trống" }),
    assetId: z.string(),
    quantity: zSafeNumber("Số lượng", { min: 1 }),
    assetName: z.string().min(1, { message: "Tên tài sản không được để trống" }),
    price: zSafeNumber("Giá", { min: 1 }),
    description: z.string().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.assetBeLongTo === "PHONG" && !val.assetId) {
      ctx.addIssue({
        path: ["assetId"],
        code: z.ZodIssueCode.custom,
        message: "Mã tài sản không được để trống khi thuộc về phòng",
      });
    }
  });

export const roomAssetBulkSchema = z
  .object({
    roomId: z.union([z.string(), z.array(z.string())]).refine(
      (val) => {
        if (typeof val === "string") return val.trim() !== "";
        return Array.isArray(val) && val.length > 0 && val.every((v) => v.trim() !== "");
      },
      {
        message: "Vui lòng chọn ít nhất một phòng.",
      }
    ),
    assetId: z.union([z.string(), z.array(z.string())]).refine(
      (val) => {
        if (typeof val === "string") return val.trim() !== "";
        return Array.isArray(val) && val.length > 0 && val.every((v) => v.trim() !== "");
      },
      {
        message: "Vui lòng chọn ít nhất một tài sản.",
      }
    ),
  })
  .refine(
    (data) => {
      const assetCount = Array.isArray(data.assetId) ? data.assetId.length : data.assetId ? 1 : 0;
      const roomCount = Array.isArray(data.roomId) ? data.roomId.length : data.roomId ? 1 : 0;

      return (assetCount >= 2 && roomCount === 1) || (roomCount >= 2 && assetCount === 1);
    },
    {
      message: "Chỉ cho phép chọn (nhiều phòng + 1 tài sản) hoặc (1 phòng + nhiều tài sản).",
      path: ["assetId"],
    }
  );

export const addToAllRoomAssetSchema = z.object({
  assetId: z.string().min(1, "Tài sản không được để trống"),
  buildingId: z.string().min(1, "Tòa nhà không được để trống"),
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

    roomType: z.enum([RoomType.GHEP, RoomType.DON, RoomType.KHAC, RoomType.CAO_CAP], {
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
export const baseAssetSchema = z.object({
  nameAsset: z.string().min(1, "Tên tài sản không được để trống"),
  assetType: z.enum(
    [AssetType.AN_NINH, AssetType.DIEN, AssetType.GIA_DUNG, AssetType.KHAC, AssetType.NOI_THAT, AssetType.VE_SINH],
    {
      message: "Loại tài sản không hợp lệ",
    }
  ),
  assetBeLongTo: z.enum([AssetBeLongTo.CA_NHAN, AssetBeLongTo.CHUNG, AssetBeLongTo.PHONG], {
    message: "Tài sản thuộc về không hợp lệ",
  }),
  descriptionAsset: z.string().optional(),
  price: zSafeNumber("Giá", { min: 0 }),
  quantity: zSafeNumber("Số lượng", { min: 1 }),
});

export const creationAssetSchema = baseAssetSchema.extend({
  buildingId: z.string().optional(),
});

export const updateAssetSchema = baseAssetSchema.extend({
  assetStatus: z.enum(
    [
      AssetStatus.CAN_BAO_TRI,
      AssetStatus.DA_THANH_LY,
      AssetStatus.HOAT_DONG,
      AssetStatus.HUY,
      AssetStatus.HU_HONG,
      AssetStatus.KHONG_SU_DUNG,
      AssetStatus.THAT_LAC,
    ],
    { message: "Trạng thái tài sản không hợp lệ" }
  ),
});

/* TENANT */
export const createOrUpdateTenantSchema = z.object({
  email: z.email("Email không hợp lệ"),

  fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự").refine(isValidFullName, {
    message: "Mỗi từ trong họ tên phải có ít nhất 3 ký tự",
  }),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Ngày sinh không hợp lệ")
    .transform((val) => new Date(val))
    .refine((date) => isValidDob(date), "Tuổi của khách phải lớn hơn hoặc bằng 18"),
  phoneNumber: z
    .string()
    .min(9, "Số điện thoại phải có ít nhất 9 chữ số")
    .max(15, "Số điện thoại không được vượt quá 15 chữ số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),

  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.UNKNOWN], "Giới tính không hợp lệ"),

  identityCardNumber: z.string().regex(/^\d{12}$/, "Căn cước công dân phải 12 chữ số"),

  address: z.string().min(1, "Địa chỉ không được để trống"),

  frontCccd: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => !!val, "Bạn phải tải lên mặt trước CCCD")
    .nullable(),

  backCccd: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => !!val, "Bạn phải tải lên mặt sau CCCD")
    .nullable(),
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
export const updateContractSchema = z
  .object({
    startDate: z
      .string()
      .refine((val) => {
        return !isNaN(Date.parse(val));
      }, "Ngày kết thúc không hợp lệ")
      .transform((val) => new Date(val)),
    endDate: z
      .string()
      .refine((val) => {
        return !isNaN(Date.parse(val));
      }, "Ngày kết thúc không hợp lệ")
      .transform((val) => new Date(val)),
    deposit: z.number({ message: "Tiền cọc phải là số" }).min(1, "Tiền cọc phải lớn hơn 0"),
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

export const createContractSchema = updateContractSchema.extend({
  roomId: z.string().min(1, "Vui lòng chọn phòng"),
  tenants: z
    .array(
      z.object({
        tenantId: z.string().min(1, "Thiếu tenantId"),
        representative: z.boolean(),
      })
    )
    .min(1, "Phải có ít nhất một khách thuê"),
  content: z.string().min(1, "Không được để trống hợp đồng"),
});

export const createContractTenantSchema = z.object({
  tenantId: z.string().min(1, "Vui lòng chọn khách"),
  contractId: z.string().min(1, "Không có mã hợp đồng"),
});

export const createContractVehicleSchema = z.object({
  vehicleId: z.string().min(1, "Vui lòng chọn phương tiện"),
  contractId: z.string().min(1, "Không có mã hợp đồng"),
});

export const extendContractSchema = z
  .object({
    newEndDate: z
      .string()
      .refine((val) => {
        return !isNaN(Date.parse(val));
      }, "Ngày gia hạn không hợp lệ")
      .transform((val) => new Date(val)),
    oldEndDate: z
      .string()
      .refine((val) => {
        return !isNaN(Date.parse(val));
      }, "Ngày hạn hết cũ không hợp lệ")
      .transform((val) => new Date(val)),
  })
  .refine(
    (data) => {
      const { newEndDate, oldEndDate } = data;
      const minEndDate = new Date(oldEndDate);
      minEndDate.setMonth(minEndDate.getMonth() + 3);
      return newEndDate >= minEndDate;
    },
    {
      message: "Ngày gia hạn phải cách ngày kết thúc cũ ít nhất 3 tháng",
      path: ["newEndDate"],
    }
  );

export const noticeContractSchema = z.object({
  newEndDate: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, "Ngày báo trước không hợp lệ")
    .transform((val) => new Date(val)),
});

/* SERVICE */
export const createOrUpdateService = z.object({
  name: z.string().min(1, "Không được để trống tên dịch vụ"),
  serviceCategory: z.enum(
    [
      ServiceCategory.AN_NINH,
      ServiceCategory.BAO_TRI,
      ServiceCategory.DIEN,
      ServiceCategory.GIAT_SAY,
      ServiceCategory.GUI_XE,
      ServiceCategory.INTERNET,
      ServiceCategory.KHAC,
      ServiceCategory.NUOC,
      ServiceCategory.THANG_MAY,
      ServiceCategory.TIEN_PHONG,
      ServiceCategory.VE_SINH,
    ],
    {
      message: "Loại dịch vụ không hợp lệ",
    }
  ),
  price: zSafeNumber("Giá").refine((val) => val >= 0.0, "Giá không được âm"),
  serviceCalculation: z.enum(
    [
      ServiceCalculation.TINH_THEO_NGUOI,
      ServiceCalculation.TINH_THEO_PHONG,
      ServiceCalculation.TINH_THEO_PHUONG_TIEN,
      ServiceCalculation.TINH_THEO_SO,
    ],
    {
      message: "Tính toán dịch vụ không hợp lệ",
    }
  ),
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
});

export const createServiceRoomForBuildingSchema = z.object({
  buildingId: z.string().min(1, "Vui lòng chọn tòa nhà"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
});

export const createServiceRoomForServiceSchema = z.object({
  roomIds: z.array(z.string()).min(1, "Phải có ít nhất một phòng"),
  serviceId: z.string().min(1, "Vui lòng chọn dịch vụ"),
});

export const createServiceRoomForRoomSchema = z.object({
  serviceIds: z.array(z.string()).min(1, "Phải có ít nhất một dịch vụ"),
  roomId: z.string().min(1, "Vui lòng chọn dịch vụ"),
});

export const updateServicePriceInBuildingSchema = z.object({
  newUnitPrice: zSafeNumber("Đơn giá mới", { min: 0 }),
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
  closestIndex: zSafeNumber("Chỉ số gần nhất", { min: 0 }),
  descriptionMeter: z.string().optional(),
});

/* METER READING */
export const updateMeterReadingSchema = z.object({
  newIndex: zSafeNumber("Chỉ số cũ").refine((val) => val >= 0, "Chỉ số mới không được âm"),
  descriptionMeterReading: z.string().optional(),
});

export const createMeterReadingSchema = updateMeterReadingSchema.extend({
  meterId: z.string().min(1, "Vui lòng chọn công tơ"),
  year: zSafeNumber("Năm", { min: new Date().getFullYear() }),
  month: zSafeNumber("Tháng", { min: 1, max: 12 }),
});

// invoice
export const createInvoiceSchema = z.object({
  paymentDueDate: z.coerce.date().refine((date) => date > new Date(), {
    message: "Ngày đến hạn phải ở tương lai",
  }),
  note: z.string().optional(),
});

export const createInvoiceForContractSchema = createInvoiceSchema.extend({
  contractId: z.string().min(1, "Vui lòng chọn hợp đồng"),
});

export const createInvoiceForBuildingSchema = createInvoiceSchema.extend({
  buildingId: z.string().min(1, "Vui lòng chọn tòa nhà"),
});

export const createInvoiceForFloorSchema = createInvoiceSchema.extend({
  floorId: z.string().min(1, "Vui lòng chọn tầng nhà"),
});

export const updateInvoiceSchema = z.object({
  paymentDueDate: z.coerce.date().refine((val) => val > new Date(), {
    message: "Ngày đến hạn phải ơi tương lai",
  }),
  note: z.string().optional(),
});

export const invoiceDetailUpdateSchema = z.object({
  description: z.string().optional(),

  newIndex: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, { message: "Chỉ số mới phải ≥ 1" }).optional()
  ),
  quantity: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, { message: "Số lượng phải ≥ 1" }).optional()
  ),
  unitPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(1, { message: "Đơn giá phải ≥ 1" }).optional()
  ),
  serviceName: z.string().optional(),
});

export const invoiceDetailCreationSchema = invoiceDetailUpdateSchema
  .extend({
    invoiceId: z.string().min(1, "Mã hóa đơn không được để trống"),
    invoiceItemType: z.enum(
      [InvoiceItemType.DIEN, InvoiceItemType.NUOC, InvoiceItemType.DEN_BU, InvoiceItemType.DICH_VU],
      "Loại mục hóa đơn không hợp lệ"
    ),
    serviceRoomId: z.string().optional(),
  })
  .refine(
    (data) => {
      const { invoiceItemType, quantity } = data;
      if (invoiceItemType !== InvoiceItemType.DEN_BU) return true;
      if (!isNumber(quantity) || quantity < 1) return true;
      return quantity !== undefined || quantity !== null;
    },
    { message: "Số lượng là bắt buộc với loại ĐỀN BÙ", path: ["quantity"] }
  )
  .refine(
    (data) => {
      const { invoiceItemType, unitPrice } = data;
      if (invoiceItemType !== InvoiceItemType.DEN_BU) return true;
      if (!isNumber(unitPrice) || unitPrice < 1) return true;
      return unitPrice !== undefined || unitPrice !== null;
    },
    {
      message: "Đơn giá là bắt buộc với loại đền bù",
      path: ["unitPrice"],
    }
  )
  .refine(
    (data) => {
      const { invoiceItemType, newIndex } = data;
      if (invoiceItemType !== InvoiceItemType.DIEN && invoiceItemType !== InvoiceItemType.NUOC) return true;
      if (!isNumber(newIndex) || newIndex < 1) return true;
      return newIndex !== null || newIndex !== undefined;
    },
    {
      message: "Chỉ số mới là bắt buộc với điện hoặc nước",
      path: ["newIndex"],
    }
  )
  .refine(
    (data) => {
      if (data.invoiceItemType !== InvoiceItemType.DICH_VU) return true;
      return !!data.serviceRoomId;
    },
    {
      message: "Dịch vụ bắt buộc phải chọn phòng",
      path: ["serviceRoomId"],
    }
  );

/* PAYMENT RECEIPT */
export const rejectPaymentReceiptSchema = z.object({
  reason: z.string().min(1, "Không được để trống lý do"),
});

/* NOTIFICATION */
export const createOrUpdateNotificationSchema = z
  .object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    content: z.string().min(1, "Vui lòng nhập nội dung"),
    notificationType: z.enum(
      [NotificationType.CHUNG, NotificationType.HE_THONG, NotificationType.KHAC],
      "Loại thông báo không hợp lệ"
    ),
    sendToAll: z.boolean({ message: "Vui lòng chọn" }),
    users: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const { sendToAll, users } = data;
      if (sendToAll === false) {
        return Array.isArray(users) && users?.length > 0;
      } else return true;
    },
    {
      message: "Vui lòng chọn 1 người dùng khi chọn gửi cho tất cả",
      path: ["users"],
    }
  );
