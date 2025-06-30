import { AssetGroup, BuildingStatus, BuildingType, FloorStatus, FloorType, Gender } from "@/enums";
import { ColumnDef } from "@tanstack/react-table";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

/* BUTTONS*/
export interface IBtnType {
  tooltipContent: string;
  icon: LucideIcon;
  arrowColor: string;
  type: "default" | "upload" | "delete" | "download" | "update" | "status";
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

export type UpdateBuildingValue = ICreateBuildingValue & { status?: BuildingStatus };

export interface IBuildingStatisticsResponse {
  activeBuilding: number;
  totalBuilding: number;
  inactiveBuilding: number;
}

export interface IBuildingCardsResponse {
  buildingId: string;
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
