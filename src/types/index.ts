import { BuildingStatus, BuildingType, Gender, RoomStatus, RoomType} from "@/enums";
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
//room
export interface RoomResponse extends AbstractResponse {
  id: string;
  roomCode: string;
  acreage: number;
  price: number;
  maximumPeople: number;
  roomType: RoomType;
  roomstatus: RoomStatus;
  description: string;
  // floor?: FloorResponse;
}
export type RoomFormValue = {
  // floorId: string;
  acreage: number | null;
  price: number | null;
  maximumPeople: number | null;
  roomType: RoomType | null;
  roomstatus: RoomStatus | null;
  description: string;
};
export type RoomDeleteRequest = {
  floorId: string;
  roomCode: string;
};
export interface IRoomStatisticsResponse {
  getTotalTrong: number;
  getTotalDangThue: number;
  getTotalDaDatCoc: number;
}



