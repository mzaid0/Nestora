import api from "@/lib/axios";
import { SignupRequest } from "@/types/user-type";

export const signupApi = async (data: SignupRequest) => {
  const response = await api.post("/signup", data);
  return response.data;
};
