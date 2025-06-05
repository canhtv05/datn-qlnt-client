import { Gender } from "@/enums";

/* API RESPONSE */
export interface TokenInfo {
  accessToken: string;
  accessTokenTTL: number;
  refreshToken: string;
  refreshTokenTTL: number;
}

export interface AbstractEntity {
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
  };
}

/* ENTITY RESPONSE */
export interface UserResponse extends AbstractEntity {
  fullName: string;
  gender: Gender;
  dob: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
}
