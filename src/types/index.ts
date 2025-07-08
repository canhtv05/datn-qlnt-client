import {
  AssetGroup,
  AssetBeLongTo,
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
  ServiceType,
  ServiceStatus,
  ServiceAppliedBy,
} from "@/enums";
import { ColumnDef } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

/* BUTTONS*/
export interface IBtnType {
  tooltipContent: string;
  icon: LucideIcon;
  arrowColor: string;
  type: "default" | "upload" | "delete" | "download" | "update" | "status" | "view";
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
    floorName: string;
  };
}
export type RoomFormValue = {
  floorId: string;
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
}

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

/* Asset */
export interface ICreateAsset {
  nameAsset: string;
  assetTypeId: string;
  assetBeLongTo: AssetBeLongTo | string;
  roomID: string;
  buildingID: string;
  floorID: string;
  tenantId: string;
  price: number | undefined;
  descriptionAsset: string;
}

export type IUpdateAsset = ICreateAsset;

export interface AssetResponse extends AbstractResponse {
  nameAsset: string;
  assetTypeId: string;
  nameAssetType: string;
  assetBeLongTo: AssetBeLongTo | string;
  roomID: string;
  roomCode: string;
  buildingID: string;
  buildingName: string;
  floorID: string;
  nameFloor: string;
  tenantId: string;
  fullName: string;
  price: number;
  assetStatus: AssetStatus | string;
  descriptionAsset: string;
}

/* VEHICLE */
export interface VehicleResponse extends AbstractResponse {
  fullName: string;
  vehicleType: VehicleType | string;
  licensePlate: string;
  vehicleStatus: VehicleStatus | string;
  registrationDate: string;
  describe: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateVehicle {
  tenantId: string;
  vehicleType: VehicleType | string;
  licensePlate: string;
  vehicleStatus: VehicleStatus | string;
  registrationDate: string;
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

export interface TenantDetailResponse extends AbstractResponse {
  customerCode: string;
  buildingName: string;
  roomCode: string;
  fullName: string;
  gender: Gender | string;
  dob: string;
  email: string;
  phoneNumber: string;
  identityCardNumber: string;
  address: string;
  contractCode: string;
  endDate: string;
  tenantStatus: TenantStatus | string;
  isRepresentative: string;
}
export default interface TenantResponse extends AbstractResponse {
  customerCode: string;
  fullName: string;
  gender: Gender | string;
  dob: string;
  email: string;
  phoneNumber: string;
  tenantStatus: TenantStatus | string;
  isRepresentative: string;
  identityCardNumber: string;
  identificationNumber: string;
  address: string;
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
  status: ContractStatus;
  tenants: TenantBasicResponse[];
}

export interface ICreateAndUpdateContract {
  roomId: string;
  numberOfPeople: number;
  startDate: string | Date;
  endDate: string | Date;
  deposit: number;
  tenants: string[];
  status?: ContractStatus;
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
  type: ServiceType | string;
  unit: string;
  price: number | undefined;
  appliedBy: string;
  status: string;
  description: string;
}

export interface ServiceFilter {
  query: string;
  serviceType: ServiceType | string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  serviceStatus: ServiceStatus | string;
  serviceAppliedBy: ServiceAppliedBy | string;
}

export interface ServiceCreationAndUpdateRequest {
  name: string;
  type: ServiceType | string;
  unit: string;
  price: number | undefined;
  appliedBy: ServiceAppliedBy | string;
  status: ServiceStatus | string;
  description: string;
}

export interface ServiceCountResponse {
  getTotal: number;
  getTotalHoatDong: number;
  getTotalKhongHoatDong: number;
}
