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
