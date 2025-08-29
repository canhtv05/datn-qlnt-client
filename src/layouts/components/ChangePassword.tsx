import InputLabel from "@/components/InputLabel";
import { ChangePasswordRequest } from "@/types";
import { ChangeEvent, Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface ChangePasswordProps {
  value: ChangePasswordRequest;
  setValue: Dispatch<React.SetStateAction<ChangePasswordRequest>>;
  errors: Partial<Record<keyof ChangePasswordRequest, string>>;
}

const ChangePassword = ({ value, setValue, errors }: ChangePasswordProps) => {
  const { t } = useTranslation();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-5">
        <InputLabel
          id="oldPassword"
          name="oldPassword"
          placeholder={t("changePass.placeholderOldPassword")}
          required
          label={t("changePass.oldPassword")}
          value={value.oldPassword ?? ""}
          onChange={handleChange}
          errorText={errors.oldPassword}
        />

        <InputLabel
          id="newPassword"
          name="newPassword"
          placeholder={t("changePass.newPassword")}
          required
          label={t("changePass.newPassword")}
          value={value.newPassword ?? ""}
          onChange={handleChange}
          errorText={errors.newPassword}
          type="password"
        />

        <InputLabel
          id="reNewPassword"
          name="reNewPassword"
          placeholder={t("changePass.reNewPassword")}
          required
          label={t("changePass.reNewPassword")}
          value={value.reNewPassword ?? ""}
          onChange={handleChange}
          errorText={errors.reNewPassword}
          type="password"
        />
      </div>
    </div>
  );
};

export default ChangePassword;
