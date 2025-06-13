import { Status } from "@/enums";
import axios from "axios";
import { toast } from "sonner";

export const handleMutationError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message ?? Status.ERROR);
  } else {
    toast.error(Status.ERROR);
  }
};
