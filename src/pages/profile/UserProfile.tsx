// pages/UserProfile.tsx
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

import DialogLink from "@/components/DialogLink";
import ConfirmDialog, { AlertDialogRef } from "@/components/ConfirmDialog";
import { useAuthStore } from "@/zustand/authStore";
import { formatFullName, updateUserSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { updateUser } from '@/api/userUpdate';
import { Gender, Status } from "@/enums";
import UserAvatar from "@/pages/profile/UserAvatar";
import UserInfoForm from "@/pages/profile/UserInfoForm";
import type { UserResponse } from "@/types";


export interface UserProfileValue {
  fullName: string;
  profilePicture: string;
  gender: Gender;
  dob: string;
  phoneNumber: string;
  email: string;
}

const UserProfile = () => {
  const dialogRef = useRef<AlertDialogRef>(null);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<UserProfileValue>({
    dob: user?.dob ?? "",
    fullName: user?.fullName ?? "",
    gender: user?.gender ?? Gender.UNKNOWN,
    profilePicture: user?.profilePicture ?? "",
    phoneNumber: user?.phoneNumber ?? "",
    email: user?.email ?? "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<UserProfileValue>();

  const handleShowDialog = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dialogRef.current?.open();
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const rawDob = value.dob ? new Date(value.dob) : undefined;
      if (rawDob && isNaN(rawDob.getTime())) {
        toast.error("Ngày sinh không hợp lệ.");
        setLoading(false);
        return;
      }

      const parsed = updateUserSchema.safeParse({
        ...value,
        dob: rawDob,
      });

      if (!parsed.success) {
        handleZodErrors(parsed.error);
        setLoading(false);
        return;
      }

      clearErrors();

      const dob = parsed.data.dob!;
      const dobFormatted = `${dob.getFullYear()}-${(dob.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${dob.getDate().toString().padStart(2, "0")}`;

      const payload = {
        fullName: parsed.data.fullName,
        profilePicture: parsed.data.profilePicture,
        gender: parsed.data.gender,
        dob: dobFormatted,
        phoneNumber: parsed.data.phoneNumber,
      };

      await updateUser(payload);
      console.log("Update done"); // thử in ra
      const updatedUser = {
      ...user,
      ...payload,
} as UserResponse;

setUser(updatedUser, true);
      toast.success(Status.UPDATE_SUCCESS);
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof UserProfileValue, val: any) => {
    setValue((prev) => ({ ...prev, [key]: val }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        handleChange("profilePicture", reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBlur = () => {
    setValue((prev) => ({
      ...prev,
      fullName: formatFullName(String(prev.fullName)),
    }));
  };

  return (
    <DialogLink title="Hồ sơ cá nhân">
      <form
        className="px-5 py-5 flex md:flex-row flex-col md:gap-20 gap-10 justify-between"
        onSubmit={handleShowDialog}
      >
        <UserAvatar
          profilePicture={value.profilePicture}
          fullName={value.fullName}
          onImageChange={handleImageChange}
        />
        <UserInfoForm
          value={value}
          errors={errors}
          loading={loading}
          onChange={handleChange}
          onBlurFullName={handleBlur}
        />
      </form>
      <ConfirmDialog
        ref={dialogRef}
        typeTitle="chỉnh sửa"
        onContinue={handleUpdate}
      />
    </DialogLink>
  );
};

export default UserProfile;
