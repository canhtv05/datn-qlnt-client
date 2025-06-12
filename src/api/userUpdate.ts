import { httpRequest } from "@/utils/httpRequest";

export interface UpdateUserPayload {
  fullName: string;
  profilePicture?: string | null;
  gender: 'MALE' | 'FEMALE' | 'UNKNOWN';
  dob: string;
  phoneNumber: string;  
}

function removeNullOrUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined)
  ) as Partial<T>;
}

export async function updateUser(payload: UpdateUserPayload) {
  try {
    const cleanedPayload = removeNullOrUndefined(payload);
    console.log("Payload đã được làm sạch:", cleanedPayload);

    const response = await httpRequest.patch('/auth/me/update', cleanedPayload);
    console.log("Cập nhật thành công:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Lỗi cập nhật:", error.response?.data || error.message);

    const message =
      error.response?.data?.message ||
      error.message ||
      "Cập nhật hồ sơ thất bại.";

    throw new Error(message);
  }
}
