export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignupResponse {
  id: string;
  username: string;
  email: string;
  token: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGoogleAuth {
  name: string | null;
  email: string | null;
  avatar: string | null;
}
