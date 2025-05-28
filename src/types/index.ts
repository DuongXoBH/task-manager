export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}

export interface ILoginResponse {
  token: string;
  user: IUserResponse;
}
