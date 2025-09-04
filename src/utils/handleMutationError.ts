import { Status } from "@/enums";
import axios from "axios";
import { toast } from "sonner";
import i18next from "i18next";

export const handleMutationError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message ?? i18next.t(Status.ERROR));
  } else {
    toast.error(i18next.t(Status.ERROR));
  }
};
