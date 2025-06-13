import { FormEvent, useRef } from "react";
import { Camera, X } from "lucide-react";

import DialogLink from "@/components/DialogLink";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import Image from "@/components/Image";
import InputLabel from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Gender } from "@/enums";
import ConfirmDialog, { AlertDialogRef } from "@/components/ConfirmDialog";
import DatePickerLabel from "@/components/DatePickerLabel";
import { useProfile } from "./useProfile";
import RenderIf from "@/components/RenderIf";

const genderData = [
  { label: "Nam", value: Gender.MALE },
  { label: "Nữ", value: Gender.FEMALE },
];

const UserProfile = () => {
  const dialogRef = useRef<AlertDialogRef>(null);

  const handleShowDialog = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dialogRef.current?.open();
  };

  const {
    errors,
    user,
    handleBlur,
    handleChange,
    handleUpdate,
    setValue,
    value,
    handleChangeImg,
    handleClearImage,
    handleFileChange,
    tmpImg,
    inputRef,
    isDataUpdateEqual,
  } = useProfile();

  return (
    <DialogLink title="Hồ sơ cá nhân">
      <form
        className="px-5 py-5 flex md:flex-row flex-col md:gap-20 gap-10 justify-between"
        onSubmit={handleShowDialog}
      >
        <div className="flex flex-col gap-5 items-center">
          <div className="relative">
            <Image src={tmpImg} alt={value?.fullName} className="md:size-[140px] sm:size-[120px] size-[100px]" />
            <input type="file" className="hidden" accept="image/*" ref={inputRef} onChange={handleFileChange} />
            <Button
              size={"icon"}
              type="button"
              className="absolute bottom-0 right-0 rounded-full cursor-pointer border bg-background hover:bg-muted"
              onClick={handleChangeImg}
            >
              <Camera className="text-foreground size-4" />
            </Button>
            <RenderIf value={tmpImg !== value.profilePicture}>
              <button
                type="button"
                className="absolute top-2 right-2 bg-background cursor-pointer p-1 rounded-full"
                onClick={handleClearImage}
              >
                <X className="text-foreground size-3" />
              </button>
            </RenderIf>
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
            name="fullName"
            label="Tên người dùng:"
            placeholder="Nhập tên người dùng"
            value={value?.fullName ?? ""}
            onChange={handleChange}
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
          <DatePickerLabel
            date={value?.dob ? new Date(value?.dob) : new Date()}
            setDate={(d) => setValue((prev) => ({ ...prev, dob: d.toISOString() }))}
            label="Ngày sinh:"
            errorText={errors.dob}
          />
          <InputLabel
            type="text"
            id="phone"
            name="phoneNumber"
            label="Số điện thoại:"
            placeholder="Nhập số điện thoại"
            value={value?.phoneNumber ?? ""}
            onChange={handleChange}
            errorText={errors.phoneNumber}
          />
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant={"ghost"}>Hủy</Button>
            </DialogClose>
            <Button type="submit" disabled={isDataUpdateEqual()}>
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
