export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserResponse;
  message: string;
}
