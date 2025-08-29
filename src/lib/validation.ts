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
    address: z.string().min(1, t("validation:address.required")),
    buildingName: z.string().min(1, t("validation:buildingName.required")),

    actualNumberOfFloors: zSafeNumber(t("validation:actualNumberOfFloors.label"), { min: 1 }),
    numberOfFloorsForRent: zSafeNumber(t("validation:numberOfFloorsForRent.label"), { min: 1 }),

    buildingType: z.enum(
      [BuildingType.CAN_HO_DICH_VU, BuildingType.CHUNG_CU_MINI, BuildingType.KHAC, BuildingType.NHA_TRO],
      { message: t("validation:buildingType.invalid") }
    ),

    description: z.string().optional(),
  })
  .refine(
    (data) =>
      typeof data.actualNumberOfFloors === "number" &&
      typeof data.numberOfFloorsForRent === "number" &&
      data.actualNumberOfFloors >= data.numberOfFloorsForRent,
    {
      message: t("validation:numberOfFloorsForRent.notGreater"),
      path: ["numberOfFloorsForRent"],
    }
  );
/* FLOOR */
export const createFloorSchema = z.object({
  maximumRoom: zSafeNumber(t("validation:maximumRoom.label"), { min: 1 })
    .transform((val) => Number(val))
    .refine((val) => val >= 1 && val <= 99, t("validation:maximumRoom.range")),

  floorType: z.enum([FloorType.CHO_THUE, FloorType.DE_O, FloorType.KHAC, FloorType.KHO, FloorType.KHONG_CHO_THUE], {
    message: t("validation:floorType.invalid"),
  }),

  descriptionFloor: z.string().optional(),
});

export const updateFloorSchema = createFloorSchema.extend({
  nameFloor: z.string().min(1, t("validation:nameFloor.required")),
});

/* ASSET TYPE */
export const createOrUpdateAssetTypeSchema = z.object({
  nameAssetType: z.string().min(1, t("validation:nameAssetType.required")),

  assetGroup: z.enum([AssetGroup.CA_NHAN, AssetGroup.DIEN, AssetGroup.GIA_DUNG, AssetGroup.KHAC, AssetGroup.NOI_THAT], {
    message: t("validation:assetGroup.invalid"),
  }),

  descriptionAssetType: z.string().min(1, t("validation:descriptionAssetType.required")),
});

/* ROOM ASSET */
export const roomAssetFormSchema = z
  .object({
    assetBeLongTo: z.string().min(1, { message: t("validation:assetBeLongTo.required") }),

    roomId: z.string().min(1, { message: t("validation:roomId.required") }),

    assetId: z.string(),

    quantity: zSafeNumber(t("validation:quantity.label"), { min: 1 }),

    assetName: z.string().min(1, { message: t("validation:assetName.required") }),

    price: zSafeNumber(t("validation:price.label"), { min: 1 }),

    description: z.string().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val.assetBeLongTo === "PHONG" && !val.assetId) {
      ctx.addIssue({
        path: ["assetId"],
        code: z.ZodIssueCode.custom,
        message: t("validation:assetId.requiredWhenBelongToRoom"),
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
        message: t("validation:roomId.bulkRequired"),
      }
    ),
    assetId: z.union([z.string(), z.array(z.string())]).refine(
      (val) => {
        if (typeof val === "string") return val.trim() !== "";
        return Array.isArray(val) && val.length > 0 && val.every((v) => v.trim() !== "");
      },
      {
        message: t("validation:assetId.bulkRequired"),
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
      message: t("validation:assetRoomSelection.invalidCombination"),
      path: ["assetId"],
    }
  );

export const addToAllRoomAssetSchema = z.object({
  assetId: z.string().min(1, t("validation:assetId.required")),
  buildingId: z.string().min(1, t("validation:buildingId.required")),
});

/* ROOM */
export const createOrUpdateRoomSchema = z
  .object({
    floorId: z.string().min(1, { message: t("validation:floorId.required") }),

    acreage: zSafeNumber(t("validation:acreage.label")).refine((val) => val >= 1, {
      message: t("validation:acreage.min"),
    }),

    price: z
      .union([zSafeNumber(t("validation:price.label")), z.literal(null)])
      .refine((val) => val === null || val >= 0, {
        message: t("validation:price.nonNegative"),
      }),

    maximumPeople: z
      .union([zSafeNumber(t("validation:maximumPeople.label")), z.literal(null)])
      .refine((val) => val === null || val >= 1, {
        message: t("validation:maximumPeople.min"),
      }),

    roomType: z.enum([RoomType.GHEP, RoomType.DON, RoomType.KHAC, RoomType.CAO_CAP], {
      message: t("validation:roomType.invalid"),
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
      { message: t("validation:roomStatus.invalid") }
    ),

    description: z.string().optional().nullable(),
  })
  .refine(
    (data) =>
      typeof data.acreage === "number" && (data.maximumPeople === null || typeof data.maximumPeople === "number"),
    {
      message: t("validation:room.invalidData"),
      path: ["maximumPeople"],
    }
  );

/* ASSET */
export const baseAssetSchema = z.object({
  nameAsset: z.string().min(1, t("validation:nameAsset.required")),

  assetType: z.enum(
    [AssetType.AN_NINH, AssetType.DIEN, AssetType.GIA_DUNG, AssetType.KHAC, AssetType.NOI_THAT, AssetType.VE_SINH],
    { message: t("validation:assetType.invalid") }
  ),

  assetBeLongTo: z.enum([AssetBeLongTo.CA_NHAN, AssetBeLongTo.CHUNG, AssetBeLongTo.PHONG], {
    message: t("validation:assetBeLongTo2.invalid"),
  }),

  descriptionAsset: z.string().optional(),

  price: zSafeNumber(t("validation:price.label"), { min: 0 }),

  quantity: zSafeNumber(t("validation:quantity.label"), { min: 1 }),
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
    { message: t("validation:assetStatus.invalid") }
  ),
});

/* TENANT */
export const createOrUpdateTenantSchema = z.object({
  email: z.string().email(t("validation:email.invalid")),

  fullName: z
    .string()
    .min(3, t("validation:fullName.min"))
    .refine(isValidFullName, { message: t("validation:fullName.wordMin") }),

  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), t("validation:dob.invalid"))
    .transform((val) => new Date(val))
    .refine((date) => isValidDob(date), t("validation:dob.age")),

  phoneNumber: z
    .string()
    .min(9, t("validation:phone.min"))
    .max(11, t("validation:phone.max"))
    .regex(/^[0-9]+$/, t("validation:phone.onlyNumber"))
    .regex(/^(03|05|07|08|09)\d{8}$/, {
      message: t("validation:phone.pattern"),
    }),

  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.UNKNOWN], {
    message: t("validation:gender.invalid"),
  }),

  identityCardNumber: z.string().regex(/^\d{12}$/, t("validation:identityCardNumber.invalid")),

  address: z.string().min(1, t("validation:address.required")),

  frontCccd: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => !!val, t("validation:frontCccd.required"))
    .nullable(),

  backCccd: z
    .union([z.instanceof(File), z.string()])
    .refine((val) => !!val, t("validation:backCccd.required"))
    .nullable(),
});

/* VEHICLE */
export const createVehicleSchema = z
  .object({
    tenantId: z.string().min(1, t("validation:tenantId.required")),

    vehicleType: z.enum([VehicleType.KHAC, VehicleType.O_TO, VehicleType.XE_DAP, VehicleType.XE_MAY], {
      message: t("validation:vehicleType.invalid"),
    }),

    licensePlate: z.string(),

    vehicleStatus: z.enum([VehicleStatus.TAM_KHOA, VehicleStatus.SU_DUNG], {
      message: t("validation:vehicleStatus.invalid"),
    }),

    registrationDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), t("validation:registrationDate.invalid"))
      .transform((val) => new Date(val)),

    describe: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.vehicleType === VehicleType.XE_DAP || data.vehicleType === VehicleType.KHAC) {
        return true;
      }
      return data.licensePlate.trim().length > 0;
    },
    {
      message: t("validation:licensePlate.required"),
      path: ["licensePlate"],
    }
  );

export const updateVehicleSchema = z.object({
  vehicleStatus: z.enum([VehicleStatus.TAM_KHOA, VehicleStatus.SU_DUNG], {
    message: t("validation:vehicleStatus.invalid"),
  }),
  describe: z.string(),
});

/*CONTRACT*/
export const updateContractSchema = z
  .object({
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), t("validation:startDate.invalid"))
      .transform((val) => new Date(val)),

    endDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), t("validation:endDate.invalid"))
      .transform((val) => new Date(val)),

    deposit: z.number({ message: t("validation:deposit.number") }).min(1, t("validation:deposit.min")),
  })
  .refine(
    (data) => {
      const { startDate, endDate } = data;
      const minEndDate = new Date(startDate);
      minEndDate.setMonth(minEndDate.getMonth() + 3);
      return endDate >= minEndDate;
    },
    {
      message: t("validation:endDate.minRange"),
      path: ["endDate"],
    }
  );

export const createContractSchema = updateContractSchema.extend({
  roomId: z.string().min(1, t("validation:roomId1.required")),
  tenants: z
    .array(
      z.object({
        tenantId: z.string().min(1, t("validation:tenantId.required")),
        representative: z.boolean(),
      })
    )
    .min(1, t("validation:tenants.min")),
  content: z.string().min(1, t("validation:content.required")),
});

export const createContractTenantSchema = z.object({
  tenantId: z.string().min(1, t("validation:tenantId.required")),
  contractId: z.string().min(1, t("validation:contractId.required")),
});

export const createContractVehicleSchema = z.object({
  vehicleId: z.string().min(1, t("validation:vehicleId.required")),
  contractId: z.string().min(1, t("validation:contractId.required")),
});

export const extendContractSchema = z
  .object({
    newEndDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), t("validation:newEndDate.invalid"))
      .transform((val) => new Date(val)),

    oldEndDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), t("validation:oldEndDate.invalid"))
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
      message: t("validation:newEndDate.minRange"),
      path: ["newEndDate"],
    }
  );

export const noticeContractSchema = z.object({
  newEndDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), t("validation:noticeDate.invalid"))
    .transform((val) => new Date(val)),
});

/* SERVICE */
export const createOrUpdateService = z.object({
  name: z.string().min(1, t("validation:service.name.required")),

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
      message: t("validation:service.category.invalid"),
    }
  ),

  price: zSafeNumber(t("validation:service.price.label")).refine(
    (val) => val >= 0.0,
    t("validation:service.price.nonNegative")
  ),

  serviceCalculation: z.enum(
    [
      ServiceCalculation.TINH_THEO_NGUOI,
      ServiceCalculation.TINH_THEO_PHONG,
      ServiceCalculation.TINH_THEO_PHUONG_TIEN,
      ServiceCalculation.TINH_THEO_SO,
    ],
    {
      message: t("validation:service.calculation.invalid"),
    }
  ),

  description: z.string().optional(),
});
/* DEFAULT SERVICE */
export const updateDefaultServiceSchema = z.object({
  defaultServiceAppliesTo: z.enum([DefaultServiceAppliesTo.HOP_DONG, DefaultServiceAppliesTo.PHONG], {
    message: t("validation:defaultService.appliesTo.invalid"),
  }),

  pricesApply: zSafeNumber(t("validation:defaultService.price.label")).refine(
    (val) => val >= 0.0,
    t("validation:defaultService.price.nonNegative")
  ),

  defaultServiceStatus: z.enum(
    [DefaultServiceStatus.HOAT_DONG, DefaultServiceStatus.TAM_DUNG, DefaultServiceStatus.HUY_BO],
    {
      message: t("validation:defaultService.status.invalid"),
    }
  ),

  description: z.string().optional(),
});

export const creationDefaultServiceSchema = updateDefaultServiceSchema.extend({
  startApplying: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), t("validation:defaultService.startApplying.invalid"))
    .transform((val) => new Date(val)),

  buildingId: z.string().min(1, t("validation:defaultService.building.required")),
  floorId: z.string().min(1, t("validation:defaultService.floor.required")),
  serviceId: z.string().min(1, t("validation:defaultService.service.required")),
});

/* SERVICE ROOM */
export const createServiceRoomSchema = z.object({
  roomId: z.string().min(1, t("validation:serviceRoom.room.required")),
  serviceId: z.string().min(1, t("validation:serviceRoom.service.required")),
});

export const createServiceRoomForBuildingSchema = z.object({
  buildingId: z.string().min(1, t("validation:serviceRoom.building.required")),
  serviceId: z.string().min(1, t("validation:serviceRoom.service.required")),
});

export const createServiceRoomForServiceSchema = z.object({
  roomIds: z.array(z.string()).min(1, t("validation:serviceRoom.room.min")),
  serviceId: z.string().min(1, t("validation:serviceRoom.service.required")),
});

export const createServiceRoomForRoomSchema = z.object({
  serviceIds: z.array(z.string()).min(1, t("validation:serviceRoom.service.min")),
  roomId: z.string().min(1, t("validation:serviceRoom.room.required")),
});

export const updateServicePriceInBuildingSchema = z.object({
  newUnitPrice: zSafeNumber(t("validation:serviceRoom.price.label"), { min: 0 }),
});

export const updateServiceRoomSchema = createServiceRoomSchema.extend({
  serviceRoomStatus: z.enum([ServiceRoomStatus.DANG_SU_DUNG, ServiceRoomStatus.DA_HUY, ServiceRoomStatus.TAM_DUNG], {
    message: t("validation:serviceRoom.status.invalid"),
  }),
});

/* METER */
export const createOrUpdateMeterSchema = z.object({
  roomId: z.string().min(1, t("validation:meter.room.required")),
  serviceId: z.string().min(1, t("validation:meter.service.required")),
  meterType: z.enum([MeterType.DIEN, MeterType.NUOC], {
    message: t("validation:meter.type.invalid"),
  }),
  meterName: z.string().min(1, t("validation:meter.name.required")),
  meterCode: z.string().min(1, t("validation:meter.code.required")),
  manufactureDate: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, t("validation:meter.manufactureDate.invalid"))
    .transform((val) => new Date(val))
    .refine((val) => {
      const date = new Date();
      return val <= date;
    }, t("validation:meter.manufactureDate.future")),
  closestIndex: zSafeNumber(t("validation:meter.closestIndex.label"), { min: 0 }),
  descriptionMeter: z.string().optional(),
});

export const changeMeterSchema = z.object({
  meterName: z.string().min(1, t("validation:meter.name.required")),
  meterCode: z.string().min(1, t("validation:meter.code.required")),
  manufactureDate: z
    .string()
    .refine((val) => {
      return !isNaN(Date.parse(val));
    }, t("validation:meter.manufactureDate.invalid"))
    .transform((val) => new Date(val))
    .refine((val) => {
      const date = new Date();
      return val <= date;
    }, t("validation:meter.manufactureDate.future")),
  closestIndex: zSafeNumber(t("validation:meter.closestIndex.label"), { min: 0 }),
  descriptionMeter: z.string().optional(),
});

/* METER READING */
export const updateMeterReadingSchema = z.object({
  newIndex: zSafeNumber(t("validation:meterReading.newIndex.label")).refine(
    (val) => val >= 0,
    t("validation:meterReading.newIndex.negative")
  ),
  descriptionMeterReading: z.string().optional(),
});

export const createMeterReadingSchema = updateMeterReadingSchema.extend({
  meterId: z.string().min(1, t("validation:meterReading.meter.required")),
  year: zSafeNumber(t("validation:meterReading.year.label"), {
    min: new Date().getFullYear(),
  }),
  month: zSafeNumber(t("validation:meterReading.month.label"), {
    min: 1,
    max: 12,
  }),
});

// invoice
export const createInvoiceSchema = z.object({
  paymentDueDate: z.coerce.date().refine((date) => date > new Date(), {
    message: t("validation:invoice.paymentDueDate.future"),
  }),
  note: z.string().optional(),
});

export const createInvoiceForContractSchema = createInvoiceSchema.extend({
  contractId: z.string().min(1, t("validation:invoice.contract.required")),
});

export const createInvoiceForBuildingSchema = createInvoiceSchema.extend({
  buildingId: z.string().min(1, t("validation:invoice.building.required")),
});

export const createInvoiceForFloorSchema = createInvoiceSchema.extend({
  floorId: z.string().min(1, t("validation:invoice.floor.required")),
});

export const updateInvoiceSchema = z.object({
  paymentDueDate: z.coerce.date().refine((val) => val > new Date(), {
    message: t("validation:invoice.paymentDueDate.future"),
  }),
  note: z.string().optional(),
});

export const invoiceDetailUpdateSchema = z.object({
  description: z.string().optional(),

  newIndex: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(1, { message: t("validation:invoice.newIndex.min") })
      .optional()
  ),
  quantity: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(1, { message: t("validation:invoice.quantity.min") })
      .optional()
  ),
  unitPrice: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(1, { message: t("validation:invoice.unitPrice.min") })
      .optional()
  ),
  serviceName: z.string().optional(),
});

export const invoiceDetailCreationSchema = invoiceDetailUpdateSchema
  .extend({
    invoiceId: z.string().min(1, t("validation:invoice.invoiceId.required")),
    invoiceItemType: z.enum(
      [InvoiceItemType.DIEN, InvoiceItemType.NUOC, InvoiceItemType.DEN_BU, InvoiceItemType.DICH_VU],
      { message: t("validation:invoice.invoiceItemType.invalid") }
    ),
    serviceRoomId: z.string().optional(),
  })
  .refine(
    (data) => {
      const { invoiceItemType, quantity } = data;
      if (invoiceItemType !== InvoiceItemType.DEN_BU) return true;
      return quantity !== undefined && quantity !== null && isNumber(quantity) && quantity >= 1;
    },
    { message: t("validation:invoice.quantity.requiredForCompensation"), path: ["quantity"] }
  )
  .refine(
    (data) => {
      const { invoiceItemType, unitPrice } = data;
      if (invoiceItemType !== InvoiceItemType.DEN_BU) return true;
      return unitPrice !== undefined && unitPrice !== null && isNumber(unitPrice) && unitPrice >= 1;
    },
    { message: t("validation:invoice.unitPrice.requiredForCompensation"), path: ["unitPrice"] }
  )
  .refine(
    (data) => {
      const { invoiceItemType, newIndex } = data;
      if (invoiceItemType !== InvoiceItemType.DIEN && invoiceItemType !== InvoiceItemType.NUOC) return true;
      return newIndex !== undefined && newIndex !== null && isNumber(newIndex) && newIndex >= 1;
    },
    { message: t("validation:invoice.newIndex.requiredForElectricOrWater"), path: ["newIndex"] }
  )
  .refine(
    (data) => {
      if (data.invoiceItemType !== InvoiceItemType.DICH_VU) return true;
      return !!data.serviceRoomId;
    },
    { message: t("validation:invoice.serviceRoom.requiredForService"), path: ["serviceRoomId"] }
  );

/* PAYMENT RECEIPT */
export const rejectPaymentReceiptSchema = z.object({
  reason: z
    .string()
    .min(1, t("validation:rejectPaymentReceipt.reason.required"))
    .max(255, t("validation:rejectPaymentReceipt.reason.maxLength")),
});

/* NOTIFICATION */
export const createOrUpdateNotificationSchema = z
  .object({
    title: z.string().min(1, t("validation:notification.title.required")),
    content: z.string().min(1, t("validation:notification.content.required")),
    notificationType: z.enum([NotificationType.CHUNG, NotificationType.HE_THONG, NotificationType.KHAC], {
      message: t("validation:notification.notificationType.invalid"),
    }),
    sendToAll: z.boolean({ message: t("validation:notification.sendToAll.required") }),
    users: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      const { sendToAll, users } = data;
      if (sendToAll === false) {
        return Array.isArray(users) && users?.length > 0;
      }
      return true;
    },
    {
      message: t("validation:notification.users.requiredWhenNotAll"),
      path: ["users"],
    }
  );
