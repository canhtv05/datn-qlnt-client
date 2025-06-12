import { Gender, Status } from "@/enums";
import { useFormErrors } from "@/hooks/useFormErrors";
import { formatFullName, updateUserSchema } from "@/lib/validation";
import { ApiResponse, UserResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useAuthStore } from "@/zustand/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface UserProfileValue {
  fullName: string | undefined;
  profilePicture: string | undefined;
  gender: Gender | undefined;
  dob: string | undefined;
  phoneNumber: string | undefined;
}

export const useProfile = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [value, setValue] = useState<UserProfileValue>({
    dob: user?.dob ?? "",
    fullName: user?.fullName ?? "",
    gender: user?.gender ?? Gender.UNKNOWN,
    profilePicture: user?.profilePicture ?? "",
    phoneNumber: user?.phoneNumber ?? "",
  });

  const [tmpImg, setTmpImg] = useState<string>(user?.profilePicture ?? "");
  const [file, setFile] = useState<File>();

  const { clearErrors, errors, handleZodErrors } = useFormErrors<UserProfileValue>();

  const updateProfileMutation = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (data: FormData) =>
      await httpRequest.patch<ApiResponse<UserResponse>>("/user/me/update", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (data) => {
      toast.success(Status.UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["current-user, authenticate"] });
      setUser(data.data.data, true);
      setFile(undefined);

      setValue({
        dob: data.data.data.dob,
        fullName: data.data.data.fullName,
        gender: data.data.data.gender,
        profilePicture: data.data.data.profilePicture,
        phoneNumber: data.data.data.phoneNumber,
      });

      setTmpImg(data.data.data.profilePicture ?? "");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? Status.UPDATE_FAILED);
      } else {
        toast.error(Status.UPDATE_FAILED);
      }
    },
  });

  const isDataUpdateEqual = useCallback(() => {
    return (
      user?.dob === value.dob &&
      user?.fullName === value.fullName &&
      user?.gender === value.gender &&
      user?.phoneNumber === value.phoneNumber &&
      !file
    );
  }, [
    file,
    user?.dob,
    user?.fullName,
    user?.gender,
    user?.phoneNumber,
    value.dob,
    value.fullName,
    value.gender,
    value.phoneNumber,
  ]);

  const handleUpdate = useCallback(async () => {
    const isUnchanged = isDataUpdateEqual();

    if (isUnchanged) {
      toast.warning("Không có thay đổi nào");
      return;
    }

    try {
      await updateUserSchema.parseAsync(value);

      const formData = new FormData();

      const dateOfBirth = value.dob ? new Date(value.dob).toISOString().split("T")[0] : "";

      formData.append("fullName", value.fullName ?? "");
      formData.append("gender", value.gender ?? "");
      formData.append("dob", dateOfBirth);
      formData.append("phoneNumber", value.phoneNumber ?? "");

      if (file) {
        formData.append("file", file);
      }

      clearErrors();

      updateProfileMutation.mutate(formData);
    } catch (error) {
      handleZodErrors(error);
    }
  }, [isDataUpdateEqual, clearErrors, file, handleZodErrors, updateProfileMutation, value]);

  const handleBlur = () => {
    setValue((prev) => ({
      ...prev,
      fullName: formatFullName(String(prev.fullName)),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeImg = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ các định dạng ảnh JPG, JPEG, PNG, hoặc WEBP");
      return;
    }

    setFile(file);
    const objectURL = URL.createObjectURL(file);
    setTmpImg(objectURL);
  };

  const handleClearImage = useCallback(() => {
    setTmpImg((prev) => {
      URL.revokeObjectURL(prev);
      return value.profilePicture ?? "";
    });
    setFile(undefined);
  }, [value.profilePicture]);

  return {
    value,
    setValue,
    handleBlur,
    handleChange,
    handleUpdate,
    errors,
    user,
    handleChangeImg,
    handleClearImage,
    handleFileChange,
    tmpImg,
    inputRef,
    isDataUpdateEqual,
  };
};
