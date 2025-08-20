import { Camera, X } from "lucide-react";

import DialogLink from "@/components/DialogLink";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import Image from "@/components/Image";
import InputLabel from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Gender } from "@/enums";
import DatePickerLabel from "@/components/DatePickerLabel";
import { useProfile } from "./useProfile";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { GENDER_OPTIONS } from "@/constant";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
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

  const { ConfirmDialog, openDialog } = useConfirmDialog({
    onConfirm: handleUpdate,
  });

  const { t } = useTranslation();

  return (
    <DialogLink title={t("profile.personalProfile")}>
      <form
        className="px-5 py-5 flex md:flex-row flex-col md:gap-20 gap-10 justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          openDialog();
        }}
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
            <RenderIf value={tmpImg !== value.profilePicture && value.profilePicture !== null}>
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
            placeholder={t("profile.enterEmail")}
            value={user?.email ?? ""}
            disabled
          />
          <InputLabel
            type="text"
            id="name"
            name="fullName"
            label={t("profile.username")}
            placeholder={t("profile.enterUsername")}
            value={value?.fullName ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            errorText={errors.fullName}
          />
          <FieldsSelectLabel
            id="gender"
            name="gender"
            placeholder={t("profile.gender")}
            label={t("profile.gender")}
            labelSelect={t("profile.gender")}
            data={GENDER_OPTIONS(t)}
            value={value?.gender ?? Gender.UNKNOWN}
            onChange={(val) => setValue((prev) => ({ ...prev, gender: val as Gender }))}
          />
          <DatePickerLabel
            date={value?.dob ? new Date(value?.dob) : new Date()}
            setDate={(d) => setValue((prev) => ({ ...prev, dob: d.toISOString() }))}
            label={t("profile.dob")}
            errorText={errors.dob}
          />
          <InputLabel
            type="text"
            id="phone"
            name="phoneNumber"
            label={t("profile.phoneNumber")}
            placeholder={t("profile.enterPhoneNumber")}
            value={value?.phoneNumber ?? ""}
            onChange={handleChange}
            errorText={errors.phoneNumber}
          />
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant={"ghost"} className="cursor-pointer">
                {t("common.button.cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isDataUpdateEqual()}>
              <span className="text-white cursor-pointer">{t("common.button.update")}</span>
            </Button>
          </div>
        </div>
      </form>
      <ConfirmDialog />
    </DialogLink>
  );
};

export default UserProfile;
