import {
  AssetGroup,
  AssetStatus,
  BuildingStatus,
  BuildingType,
  FloorStatus,
  FloorType,
  Gender,
  RoomStatus,
  RoomType,
  TenantStatus,
  VehicleStatus,
  VehicleType,
  ContractStatus,
  DefaultServiceAppliesTo,
  DefaultServiceStatus,
  ServiceStatus,
  ServiceRoomStatus,
  MeterType,
  InvoiceStatus,
  InvoiceType,
  ServiceCalculation,
  InvoiceItemType,
  ServiceCategory,
  PaymentStatus,
  PaymentMethod,
  AssetType,
  AssetBeLongTo,
  NotificationType,
  DepositStatus,
} from "@/enums";
import { ColumnDef } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

/* BUTTONS*/
export interface IBtnType {
  tooltipContent: string;
  icon: LucideIcon;
  arrowColor: string;
  type:
    | "default"
    | "toggle"
    | "upload"
    | "delete"
    | "addToAllRoom"
    | "download"
    | "update"
    | "bulkAdd"
    | "status"
    | "view"
    | "contract"
    | "floor"
    | "building"
    | "finalize"
    | "cash"
    | "history"
    | "undo"
    | "deposit1"
    | "deposit2"
    | "deposit3";
  hasConfirm: boolean;
}

/* FILTER */
export type FilterObject = Record<string, string>;

/* API RESPONSE */
export interface TokenInfo {
  accessToken: string;
  accessTokenTTL: number;
  refreshToken: string;
  refreshTokenTTL: number;
}

export interface Pagination {
  count: number;
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface AbstractResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  meta?: {
    tokenInfo?: TokenInfo;
    pagination?: Pagination;
  };
}

export interface PaginatedResponse<T> {
  data: T;
  meta?: {
    tokenInfo?: TokenInfo;
    pagination?: Pagination;
  };
}

/* ENTITY RESPONSE */
export interface UserResponse extends AbstractResponse {
  fullName: string;
  gender: Gender;
  dob: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  roles: RoleResponse[];
}

export interface RoleResponse {
  name: string;
}

/* CUSTOM COLUMN Tanstack Table */
export type CustomColumnDef<T> = ColumnDef<T> & {
  isSort?: boolean;
  label?: string;
};

export interface ColumnConfig {
  label: string;
  isSort?: boolean;
  accessorKey: string;
  hasBadge?: boolean;
  isCenter?: boolean;
  hasHighlight?: boolean;
  hasDate?: boolean;
  isHidden?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => ReactNode;
}

/* BUILDING */
export interface BuildingResponse extends AbstractResponse {
  buildingCode: string;
  buildingName: string;
  address: string;
  actualNumberOfFloors: number;
  numberOfFloorsForRent: number;
  buildingType: BuildingType;
  status: BuildingStatus;
  description: string;
}

export interface ICreateBuildingValue {
  buildingName: string;
  address: string;
  actualNumberOfFloors: number | undefined;
  numberOfFloorsForRent: number | undefined;
  buildingType: BuildingType | undefined;
  description: string;
}

export type UpdateBuildingValue = ICreateBuildingValue & {
  status?: BuildingStatus;
};

export interface IBuildingStatisticsResponse {
  activeBuilding: number;
  totalBuilding: number;
  inactiveBuilding: number;
}

export interface IBuildingCardsResponse {
  id: string;
  buildingName: string;
  address: string;
  buildingType: BuildingType;
  status: BuildingStatus;
  totalRoomAvail: number;
  totalRoom: number;
}

/* FLOOR */
export interface FloorResponse extends AbstractResponse {
  nameFloor: string;
  maximumRoom: number;
  floorType: FloorType;
  status: FloorStatus;
  buildingId: string;
  buildingName: string;
  descriptionFloor: string;
}

export interface ICreateFloorValue {
  nameFloor: string;
  maximumRoom: number | undefined;
  floorType: FloorType | undefined;
  descriptionFloor: string;
}

export type UpdateFloorValue = Pick<
  ICreateFloorValue,
  "nameFloor" | "maximumRoom" | "floorType" | "descriptionFloor"
> & {
  status?: FloorStatus;
};

export interface FloorFilterValues {
  buildingId: string;
  status: string;
  floorType: string;
  nameFloor: string;
  maxRoom: string;
}

export interface IFloorStatisticsResponse {
  buildingId: string;
  totalFloors: number;
  activeFloors: number;
  inactiveFloors: number;
}

/* Asset Type */
export interface ICreateAssetType {
  nameAssetType: string;
  assetGroup: AssetGroup | string;
  discriptionAssetType: string;
}

export type IUpdateAssetType = ICreateAssetType;

export interface AssetTypeResponse extends AbstractResponse, ICreateAssetType {}

export interface AssetTypeFilterValues {
  nameAssetType: string;
  assetGroup: AssetGroup | string;
}
/* ROOM*/
export interface RoomResponse extends AbstractResponse {
  id: string;
  roomCode: string;
  acreage: number;
  price: number;
  maximumPeople: number;
  roomType: RoomType;
  status: RoomStatus;
  description: string;
  floor: {
    id: string;
    nameFloor: string;
    buildingId: string;
    buildingName: string;
  };
}
export type RoomFormValue = {
  floorId?: string;
  acreage: number | null;
  price: number | null;
  maximumPeople: number | null;
  roomType: RoomType | null;
  status: RoomStatus | null;
  description: string;
  buildingId?: string;
};

export type RoomDeleteRequest = {
  floorId: string;
  roomCode: string;
};
export interface IRoomStatisticsResponse {
  getTotalTrong: number;
  getTotalDangThue: number;
  getTotalDaDatCoc: number;
  getTotalDangBaoTri: number;
  getTotalChuaHoanThien: number;
  getTotalTamKhoa: number;
}
export interface FloorBasicResponse {
  id: string;
  buildingId: string;
  nameFloor: string;
  floorType: string;
  status: string;
  maximumRooms: number;
  buildingName: string;
}
export interface FilterRoomValues {
  status: string;
  maxPrice: string;
  minPrice: string;
  maxAcreage: string;
  minAcreage: string;
  maximumPeople: string;
  nameFloor: string;
  buildingId: string;
  floorId: string;
}
export interface IdAndName {
  id: string;
  name: string;
  buildingId: string;
}

export type IdNameAndType = IdAndName & { type: string };

export type TenantSelectResponse = IdAndName;

export interface RoomSelectResponse extends IdAndName {
  tenants: TenantSelectResponse[];
}

export interface FloorSelectResponse extends IdAndName {
  rooms: RoomSelectResponse[];
}

export interface BuildingSelectResponse extends IdAndName {
  floors: FloorSelectResponse[];
}

export interface DefaultServiceBuildingSelectResponse extends IdAndName {
  floors: IdAndName[];
}

export interface CreateAssetInitResponse {
  assetTypes: IdAndName[];
  buildings: BuildingSelectResponse[];
}

export interface CreateAssetInit2Response {
  assetTypes: IdAndName[];
  buildings: IdAndName[];
  floors: IdAndName[];
  tenants: IdAndName[];
  rooms: IdAndName[];
}

export interface RoomDetailsResponse {
  buildingName: string;
  buildingAddress: string;
  ownerName: string;
  ownerPhone: string;
  roomCode: string;
  acreage: number;
  maximumPeople: number;
  roomType: RoomType;
  status: RoomStatus;
  description: string;
  contractCode: string;
  numberOfPeople: number;
  representativeName: string;
  representativePhone: string;
  dob: string;
  identityCardNumber: string;
  deposit: number;
  roomPrice: number;
  contractStatus: ContractStatus;
  startDate: string;
  endDate: string;
  memberInRoomCount: number;
  assetInRoomCount: number;
  serviceInRoomCount: number;
  vehicleInRoomCount: number;
}

/* Asset */
export interface ICreateAsset {
  nameAsset: string;
  assetType: string;
  assetBeLongTo: AssetBeLongTo | string;
  buildingId: string;
  price: number | undefined;
  quantity: number | undefined;
  descriptionAsset: string;
}

export interface AssetBasicResponse {
  id: string;
  nameAsset: string;
  assetType: AssetType;
  assetStatus: AssetStatus;
  description: string;
}

export interface IAssetStatisticsResponse {
  totalActiveAssets: number;
  totalAssets: number;
  totalDisabledAssets: number;
}

export interface AssetStatusStatistic {
  totalAssets: number;
  totalActiveAssets: number;
  totalBrokenAssets: number;
  totalMaintenanceAssets: number;
  totalLostAssets: number;
  totalDisabledAssets: number;
}

export type IUpdateAsset = Omit<ICreateAsset, "buildingId"> & { assetStatus: AssetStatus | string };

// export interface ICreateAsset {
//   nameAsset: string;
//   assetType: string;
//   assetBeLongTo: string;
//   price: number;
//   descriptionAsset: string;
// }

// export type IUpdateAsset = ICreateAsset;

export interface AssetResponse extends AbstractResponse {
  description: string;
  buildingName: string;
  nameAsset: string;
  assetType: AssetType;
  assetBeLongTo: AssetBeLongTo;
  assetStatus: AssetStatus;
  price: number;
  quantity: number;
  remainingQuantity: number;
}

export interface AssetFilter {
  nameAsset: string;
  assetBeLongTo: AssetBeLongTo | string;
  assetStatus: AssetStatus | string;
  assetType: AssetType | string;
}

export interface AssetRoomFilter {
  query: string;
  building: string;
  floor: string;
  roomType: RoomType | string;
  status: RoomStatus | string;
}

export interface IUpdateRoomAsset {
  assetName: string;
  price: number;
  assetStatus: AssetStatus | string;
  description: string;
}
export interface RoomAssetFilter {
  building: string;
  floor: string;
  roomType: RoomType | string;
  status: RoomStatus | string;
}

export type RoomAssetFormValue = {
  assetBeLongTo?: "PHONG" | string;
  roomId?: string;
  assetId?: string;
  assetName: string;
  price: number;
  description: string;
  assetStatus?: AssetStatus | string;
  buildingId?: string;
  quantity?: number;
};

export type AllRoomAssetFormValue = {
  assetId: string;
  buildingId: string;
};

export type RoomAssetBulkFormValue = {
  assetId: string[] | string;
  roomId: string[] | string;
};

export type RoomAssetAllFormValue = {
  id: string;
  roomCode: string;
  totalAssets: number;
  roomType: RoomType | string;
  status: RoomStatus | string;
  description: string;
};

export type RoomAssetAllResponse = {
  id: string;
  roomCode: string;
  totalAssets: number;
  roomType: RoomType;
  status: RoomStatus;
  description: string;
};

export type ICreateAndUpdateBulkRoomAsset = {
  roomId: string[];
  assetId: string[];
};

export interface RoomAssetStatisticsResponse {
  totalAssets: number;
  totalActiveAssets: number;
  totalBrokenAssets: number;
  totalMaintenanceAssets: number;
  totalLostAssets: number;
  totalDisabledAssets: number;
}

export interface RoomAssetItem {
  id: string;
  assetName: string;
  assetBeLongTo: AssetBeLongTo; // Add other enum values if needed
  price: number;
  assetStatus: AssetStatus; // Add other status types as needed
  description: string | null;
}

export type RoomAssetResponse = {
  id: string;
  roomCode: string;
  roomType: RoomType; // or RoomType if you have an enum
  status: RoomStatus; // or RoomStatus if you have an enum
  description: string;
  assets: RoomAssetItem[];
};

/* VEHICLE */
export interface VehicleResponse extends AbstractResponse {
  fullName: string;
  vehicleType: VehicleType;
  licensePlate: string;
  vehicleStatus: VehicleStatus;
  registrationDate: string;
  describe: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehiclesBasicResponse {
  id: string;
  vehicleType: VehicleType;
  licensePlate: string;
  description: string;
}

export interface ICreateVehicle {
  tenantId: string;
  vehicleType: VehicleType | string;
  licensePlate: string;
  vehicleStatus: VehicleStatus | string;
  registrationDate: string | Date;
  describe: string;
}

export type IUpdateVehicle = Pick<ICreateVehicle, "vehicleStatus" | "describe">;

export interface VehicleFilterValues {
  vehicleType: VehicleType | string;
  licensePlate: string;
}

export type VehicleTypeKey = "motorbike" | "car" | "bicycle" | "other";

export interface VehicleStatisticsResponse {
  total: number;
  byType: Record<VehicleTypeKey, number>;
}
export interface VehicleStatisticsResponse {
  total: number;
  byType: Record<VehicleTypeKey, number>;
}
/* TENANT */
export default interface TenantResponse {
  id: string;
  customerCode: string;
  fullName: string;
  gender: Gender;
  dob: string;
  userId?: string;
  email: string;
  // address: string;
  // identityCardNumber: string;
  pictureUrl: string;
  phoneNumber: string;
  tenantStatus: TenantStatus;
  contracts: ContractResponse[];
}

export interface TenantDetailResponse extends AbstractResponse {
  customerCode: string;
  fullName: string;
  gender: string;
  dob: string;
  email: string;
  phoneNumber: string;
  pictureUrl: string;
  identityCardNumber: string;
  address: string;
  tenantStatus: TenantStatus;
  totalContract: number;
}

export interface ICreateAndUpdateTenant {
  fullName: string;
  gender: Gender | string;
  dob: string;
  email: string;
  phoneNumber: string;
  identityCardNumber: string;
  address: string;
}

export interface TenantFilterValues {
  userId?: string;
  query: string;
  gender: Gender | string;
  tenantStatus: TenantStatus | string;
}

export interface ITenantStatisticsResponse {
  totalTenants: number;
  totalWaitingTenants: number;
  totalRentingTenants: number;
  totalCheckedOutTenants: number;
  totalPotentialTenants: number;
  totalCancelTenants: number;
  totalLockedTenants: number;
}
export interface TenantBasicResponse {
  id: string;
  customerCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isRepresentative: boolean;
}
/* CONTRACT*/
export interface ContractResponse extends AbstractResponse {
  contractCode: string;
  roomCode: string;
  numberOfPeople: number;
  startDate: string;
  endDate: string;
  deposit: number;
  roomPrice: number;
  status: ContractStatus;
  assets: AssetResponse[];
  tenants: TenantBasicResponse[];
  services: ServiceResponse[];
  vehicles: VehicleResponse[];
  content: string;
}

export interface ICreateAndUpdateContract {
  roomId: string;
  numberOfPeople: number;
  startDate: string | Date;
  endDate: string | Date;
  deposit: number;
  tenants: string[];
  assets: string[];
  services: string[];
  vehicles: string[];
  status: ContractStatus | undefined;
  roomPrice?: number;
  content: string;
}
export interface ContractDetailResponse {
  id: string;
  contractCode: string;
  roomCode: string;

  nameManager: string;
  phoneNumberManager: string;

  nameUser: string;
  emailUser: string;
  phoneNumberUser: string;
  identityCardUser: string;
  addressUser: string;

  numberOfPeople: number;
  startDate: string;
  endDate: string;
  deposit: number;
  roomPrice: number;
  buildingAddress: string;

  status: ContractStatus;
  createdAt: string;
  updatedAt: string;

  tenants: TenantBasicResponse[];
  content: string;
}
export interface IContractStatisticsResponse {
  totalContracts: number;
  totalActiveContracts: number;
  totalExpiredContracts: number;
  totalAboutToExpireContracts: number;
  totalLiquidatedContracts: number;
  totalCancelledContracts: number;
}
export interface ContractFilterValues {
  query: string;
  gender?: Gender | string;
  status?: ContractStatus | string;
}
export interface Option {
  label: string;
  value: string;
}

/* DEFAULT SERVICE */
export interface DefaultServiceResponse extends AbstractResponse {
  defaultServiceAppliesTo: DefaultServiceAppliesTo | string;
  pricesApply: number;
  startApplying: string;
  defaultServiceStatus: DefaultServiceStatus | string;
  buildingName: string;
  floorName: string;
  serviceName: string;
  description: string;
}

export interface DefaultServiceCreationRequest {
  defaultServiceAppliesTo: DefaultServiceAppliesTo | string;
  pricesApply: number | undefined;
  startApplying: string;
  defaultServiceStatus: DefaultServiceStatus | string;
  description: string;
  buildingId: string;
  floorId: string;
  serviceId: string;
}

export type DefaultServiceUpdateRequest = Pick<
  DefaultServiceCreationRequest,
  "defaultServiceAppliesTo" | "pricesApply" | "defaultServiceStatus" | "description"
>;

export interface DefaultServiceFilter {
  buildingId: string;
  floorId: string;
  serviceId: string;
  defaultServiceStatus: DefaultServiceStatus | string;
  defaultServiceAppliesTo: DefaultServiceAppliesTo | string;
  minPricesApply: number | undefined;
  maxPricesApply: number | undefined;
}

export interface DefaultServiceInitResponse {
  services: IdAndName[];
  buildings: DefaultServiceBuildingSelectResponse[];
}

export interface DefaultServiceStatistics {
  totalDefaultServices: number;
  activeDefaultServices: number;
  inactiveDefaultServices: number;
}

/* SERVICE */
export interface ServiceResponse extends AbstractResponse {
  name: string;
  unit: string;
  price: number;
  serviceCategory: ServiceCategory;
  serviceCalculation: ServiceCalculation;
  status: ServiceStatus;
  description: string;
}

export interface ServiceBasicResponse {
  id: string;
  name: string;
  category: ServiceCategory;
  unit: string;
  description: string;
}

export interface ServiceFilter {
  query: string;
  serviceCategory: ServiceCategory | string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  serviceStatus: ServiceStatus | string;
  serviceCalculation: ServiceCalculation | string;
}

export interface ServiceCreationRequest {
  name: string;
  serviceCategory: ServiceCategory | string;
  price: number | undefined;
  serviceCalculation: ServiceCalculation | string;
  description: string;
}

export type ServiceUpdateRequest = ServiceCreationRequest & { status: ServiceStatus | string };

export interface ServiceCountResponse {
  getTotal: number;
  getTotalHoatDong: number;
  getTotalKhongHoatDong: number;
}

/* ROOM SERVICE */
export interface ServiceRoomResponse extends AbstractResponse {
  roomCode: string;
  serviceName: string;
  unitPrice: string;
  startDate: string;
  endDate: string;
  serviceRoomStatus: string;
  description: string;
}

export interface ServiceRoomView {
  id: string;
  roomCode: string;
  totalServices: number;
  roomType: RoomType;
  status: RoomStatus;
  description: string;
}

export interface ServiceRoomDetailResponse {
  id: string;
  roomCode: string;
  roomType: string;
  status: string;
  description: string;
  services: ServiceLittleResponse[];
}

export interface ServiceLittleResponse {
  id: string;
  serviceName: string;
  unitPrice: number;
  unit: string;
  serviceRoomStatus: string;
  description: string;
}

export interface ServiceRoomCreationForBuildingRequest {
  serviceId: string;
  buildingId: string;
}

export interface ServiceRoomCreationForServiceRequest {
  serviceId: string;
  roomIds: string[];
}

export interface ServiceRoomCreationForRoomRequest {
  roomId: string;
  serviceIds: string[];
}

export interface ServiceUpdateUnitPriceRequest {
  serviceId: string;
  buildingId: string;
  newUnitPrice: number | undefined;
}

export interface ServiceRoomCreationRequest {
  roomId: string;
  serviceId: string;
}

export type ServiceRoomUpdateRequest = ServiceRoomCreationRequest & { serviceRoomStatus: ServiceRoomStatus | string };

export interface ServiceRoomFilter {
  query: string;
  building: string;
  floor: string;
  roomType: RoomType | string;
  status: RoomStatus | string;
}

export interface CreateRoomServiceInitResponse {
  rooms: IdAndName[];
  services: IdAndName[];
}

export interface ServiceRoomStatistics {
  total: number;
  active: number;
  paused: number;
}

/* METER */
export interface MeterResponse extends AbstractResponse {
  roomId: string;
  roomCode: string;
  serviceId: string;
  serviceName: string;
  meterType: MeterType;
  meterName: string;
  meterCode: string;
  manufactureDate: string;
  closestIndex: number;
  descriptionMeter: string;
}

export interface MeterCreationAndUpdatedRequest {
  roomId: string;
  serviceId: string;
  meterType: MeterType | string;
  meterName: string;
  meterCode: string;
  manufactureDate: string;
  closestIndex: number | undefined;
  descriptionMeter: string;
}

export interface MeterFilter {
  buildingId: string;
  roomId: string;
  meterType: MeterType | string;
  query: string;
}

export interface CreateMeterInitResponse {
  rooms: IdAndName[];
  services: IdNameAndType[];
}

export interface MeterInitFilterResponse {
  rooms: IdAndName[];
}

export interface MeterReadingMonthlyStatsResponse {
  meterCode: string;
  month: number;
  year: number;
  previousIndex: number;
  currentIndex: number;
  quantity: number;
}

export type MeterFindAllResponse = IdAndName[];

/* METER READING */
export interface MeterReadingResponse extends AbstractResponse {
  meterId: string;
  meterCode: string;
  meterName: string;
  meterType: MeterType;
  oldIndex: number;
  newIndex: number;
  quantity: number;
  month: number;
  year: number;
  readingDate: string;
  descriptionMeterReading: string;
}

export interface MeterReadingUpdateRequest {
  newIndex: number | undefined;
  descriptionMeterReading: string;
}

export interface MeterReadingCreationRequest {
  newIndex: number | undefined;
  descriptionMeterReading: string;
  meterId: string;
  month: number;
  year: number;
}

export interface MeterReadingFilter {
  buildingId: string;
  roomId: string;
  meterType: MeterType | string;
  month: number | undefined;
}

// invoice
export interface InvoiceCreationRequest {
  contractId: string;
  paymentDueDate: string;
  note: string;
}

export interface InvoiceBuildingCreationRequest {
  buildingId: string;
  paymentDueDate: string;
  note: string;
}

export interface InvoiceStatistics {
  total: number;
  totalPaid: number;
  totalNotYetPaid: number;
  totalOverdue: number;
  totalCancelled: number;
}

export interface InvoiceFloorCreationRequest {
  floorId: string;
  paymentDueDate: string;
  note: string;
}
export interface InvoiceResponse extends AbstractResponse {
  invoiceCode: string;
  buildingName: string;
  paymentReceiptId: string;
  roomCode: string;
  roomId: string;
  tenantName: string;
  month: number;
  year: number;
  totalAmount: number;
  paymentDueDate: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: InvoiceType;
  note: string;
}

export interface InvoiceFilter {
  query: string;
  building: string;
  floor: string;
  month: number | undefined;
  year: number | undefined;
  minTotalAmount: number | undefined;
  maxTotalAmount: number | undefined;
  invoiceStatus: InvoiceStatus | string;
  invoiceType: InvoiceType | string;
}

export interface InvoiceUpdateRequest {
  paymentDueDate: string;
  note: string;
}

export interface InvoiceDetailsResponse {
  id: string;
  invoiceId: string;
  invoiceCode: string;
  buildingName: string;
  roomCode: string;
  tenantName: string;
  tenantPhone: string;
  month: number;
  year: number;
  paymentDueDate: string;
  invoiceStatus: InvoiceStatus;
  invoiceType: InvoiceType;
  items: InvoiceItemResponse[];
  totalAmount: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}
export interface InvoiceItemResponse {
  id: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  serviceCalculation: ServiceCalculation;
  oldIndex: number;
  newIndex: number;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  description: string;
}

export interface InvoiceDetailCreationRequest {
  invoiceId: string;
  serviceName: string;
  invoiceItemType: InvoiceItemType | string;
  serviceRoomId: string;
  newIndex: number | undefined;
  quantity: number | undefined;
  unitPrice: number | undefined;
  description: string;
}

export interface InvoiceDetailUpdateRequest {
  serviceName: string;
  newIndex: number | undefined;
  quantity: number | undefined;
  unitPrice: number | undefined;
  description: string;
}

/* PAYMENT RECEIPT */
export interface PaymentReceiptResponse extends AbstractResponse {
  invoiceId: string;
  invoiceCode: string;
  receiptCode: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  collectedBy: string;
  paymentDate: string;
  note: string;
}

export interface PaymentBatchResponse {
  totalInvoices: number;
  createdReceipts: number;
  notifiedUsers: number;
}

export interface PaymentReceiptFilter {
  query: string;
  paymentStatus: PaymentStatus | string;
  paymentMethod: PaymentMethod | string;
  fromAmount: number | undefined;
  toAmount: number | undefined;
  fromDate: string;
  toDate: string;
}

export interface RejectPaymentRequest {
  reason: string;
}

export interface PaymentCreationURL {
  amount: number;
  bankCode?: string;
  language?: string;
  transactionReferenceCode: string;
}

export interface PaymentMethodResponse {
  id: string;
  paymentMethod: PaymentMethod;
}

export interface AssetRoomDetailResponse {
  id: string;
  roomCode: string;
  roomType: string;
  status: string;
  description: string;
  assets: AssetLittleResponse[];
}

export interface AssetLittleResponse {
  id: string;
  assetName: string;
  assetBeLongTo: AssetBeLongTo;
  price: number;
  quantity: number;
  assetStatus: AssetStatus;
  description: string;
}

/* SYSTEM NOTIFICATION */
export interface SystemNotificationResponse {
  systemNotificationId: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface UnreadNotificationCountResponse {
  totalUnreadNotifications: number;
}

/* NOTIFICATION */
export interface SentToUsers {
  id: string;
  fullName: string;
}

export interface NotificationResponse {
  id: string;
  title: string;
  content: string;
  image: string;
  notificationType: NotificationType;
  sendToAll: boolean;
  sentAt: string;
  userId: string;
  fullName: string;
  senderImage: string;
  sentToUsers: SentToUsers[];
}

export interface NotificationCreationAndUpdateRequest {
  title: string;
  content: string;
  image?: File | null | string;
  notificationType: NotificationType | string;
  sendToAll: boolean;
  users?: string[];
}

export interface NotificationFilter {
  query: string;
  notificationType: string | NotificationType;
  fromDate: string;
  toDate: string;
}

export interface NotificationDetailResponse {
  notificationId: string;
  title: string;
  content: string;
  notificationType: NotificationType;
  sendToAll: boolean;
  sentAt: string;
  fullName: string;
  isRead: boolean;
  readAt: string;
}

/* DEPOSIT */
export interface DepositDetailView extends AbstractResponse {
  contractId: string;
  contractCode: string;
  roomCode: string;
  depositor: string;
  depositRecipient: string;
  depositAmount: number;
  depositStatus: DepositStatus;
  depositDate: string;
  depositRefundDate: string;
  securityDepositReturnDate: string;
  note: string;
}

export interface ConfirmDepositResponse {
  id: string;
  depositStatus: DepositStatus;
}

export interface DepositFilter {
  query: string;
  depositStatus: string | DepositStatus;
}
