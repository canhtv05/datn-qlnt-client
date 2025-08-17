import { handlerRequest, httpRequest } from "@/utils/httpRequest";

export const refreshTokenRequest = async () => {
  const [error, result] = await handlerRequest(httpRequest.post("/auth/refresh-token"));
  return [error, result];
};
