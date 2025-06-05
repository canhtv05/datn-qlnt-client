import { FormEvent, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";

import { DatePickerDemo } from "@/components/DatePicker";
import DialogLink from "@/components/DialogLink";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import Image from "@/components/Image";
import InputLabel from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Gender, Status } from "@/enums";
import { useAuthStore } from "@/zustand/authStore";
import ConfirmDialog, { AlertDialogRef } from "@/components/ConfirmDialog";
import { formatFullName, updateUserSchema } from "@/lib/validation";
import { z } from "zod/v4";
import { useFormErrors } from "@/hooks/useFormErrors";

interface UserProfileValue {
  fullName: string | undefined;
  profilePicture: string | undefined;
  gender: Gender | undefined;
  dob: string | undefined;
  phoneNumber: string | undefined;
}

const genderData = [
  { label: "Nam", value: Gender.MALE },
  { label: "Nữ", value: Gender.FEMALE },
];

const UserProfile = () => {
  const dialogRef = useRef<AlertDialogRef>(null);
  const user = useAuthStore((state) => state.user);

  const [value, setValue] = useState<UserProfileValue>({
    dob: user?.dob ?? "",
    fullName: user?.fullName ?? "",
    gender: user?.gender ?? Gender.UNKNOWN,
    profilePicture: user?.profilePicture ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<UserProfileValue>();

  const handleShowDialog = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dialogRef.current?.open();
  };

  const handleUpdate = async () => {
    try {
      await updateUserSchema.parseAsync(value);
      clearErrors();
      toast.success(Status.UPDATE_SUCCESS);
    } catch (error) {
      handleZodErrors(error);
    }
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
        <div className="flex flex-col gap-5 items-center">
          <div className="relative">
            <Image
              src={value?.profilePicture}
              alt={value?.fullName}
              className="md:size-[140px] sm:size-[120px] size-[100px]"
            />
            <Button variant={"round"} size={"icon"} type="button" className="absolute bottom-0 right-0">
              <Camera className="text-foreground size-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <InputLabel
            type="text"
            id="email"
            name="email"
            label="Email:"
            placeholder="Nhập email:"
            value={user?.email ?? ""}
            disabled
          />
          <InputLabel
            type="text"
            id="name"
            name="name"
            label="Tên người dùng:"
            placeholder="Nhập tên người dùng"
            value={value?.fullName ?? ""}
            onChange={(e) => {
              setValue((prev) => ({
                ...prev,
                fullName: e.target.value,
              }));
            }}
            onBlur={handleBlur}
            errorText={errors.fullName}
          />
          <FieldsSelectLabel
            id="gender"
            placeholder="Giới tính"
            label="Giới tính:"
            labelSelect="Giới tính"
            data={genderData}
            value={value?.gender ?? Gender.UNKNOWN}
            onChange={(val) => setValue((prev) => ({ ...prev, gender: val as Gender }))}
          />
          <div className="flex flex-col">
            <Label htmlFor="gender" className="mb-1 text-label text-sm flex gap-1">
              Ngày sinh:
            </Label>
            <DatePickerDemo />
          </div>
          <InputLabel
            type="text"
            id="phone"
            name="phone"
            label="Số điện thoại:"
            placeholder="Nhập số điện thoại"
            value={value?.phoneNumber ?? ""}
            onChange={(e) => {
              setValue((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }));
            }}
            errorText={errors.phoneNumber}
          />
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant={"ghost"}>Hủy</Button>
            </DialogClose>
            <Button type="submit">
              <span className="text-white">Cập nhật</span>
            </Button>
          </div>
        </div>
      </form>
      <ConfirmDialog ref={dialogRef} typeTitle="chỉnh sửa" onContinue={handleUpdate} />
    </DialogLink>
  );
};

export default UserProfile;
