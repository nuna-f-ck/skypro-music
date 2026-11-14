import { postJson } from "./api";

export type UserType = {
  _id: number;
  email: string;
  username: string;
};

export type TokensType = {
  access: string;
  refresh: string;
};

type SignupResponse = {
  message: string;
  result: UserType;
  success: boolean;
};

export const registerUser = (
  email: string,
  password: string,
): Promise<SignupResponse> =>
  // username API требует обязательно, берём его из почты
  postJson<SignupResponse>("/user/signup/", {
    email,
    password,
    username: email,
  });

export const loginUser = (email: string, password: string): Promise<UserType> =>
  postJson<UserType>("/user/login/", { email, password });

export const getTokens = (
  email: string,
  password: string,
): Promise<TokensType> =>
  postJson<TokensType>("/user/token/", { email, password });

export const saveAuth = (user: UserType, tokens: TokensType): void => {
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
  localStorage.setItem("username", user.username);
};

export const getUsername = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("username") ?? "";
};

export const clearAuth = (): void => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
};
