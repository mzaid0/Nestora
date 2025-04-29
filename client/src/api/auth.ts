import api from "@/lib/axios";
import { IGoogleAuth, SignInRequest, SignupRequest } from "@/types/user-type";

export const signupApi = async (data: SignupRequest) => {
  const response = await api.post("/signup", data);
  return response.data;
};

export const signinApi = async (data: SignInRequest) => {
  const response = await api.post("/signin", data);
  return response.data;
};

export const googleApi = async ({ name, email, avatar }: IGoogleAuth) => {
  const response = await api.post("/google", { name, email, avatar });
  return response.data;
};
