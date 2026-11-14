import { ApiError, postJson } from "./api";

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

// событие, которое сообщает приложению, что сессия закончилась
export const AUTH_EXPIRED_EVENT = "auth:expired";

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

export const getAccess = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("access") ?? "";
};

export const getRefresh = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("refresh") ?? "";
};

export const clearAuth = (): void => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("username");
};

const SESSION_EXPIRED = "Сессия истекла. Войдите в аккаунт снова.";

// получаем новый access по refresh-токену
export const refreshAccess = async (): Promise<string> => {
  const refresh = getRefresh();

  if (!refresh) {
    throw new ApiError(SESSION_EXPIRED, 401);
  }

  try {
    const data = await postJson<{ access: string }>("/user/token/refresh/", {
      refresh,
    });
    localStorage.setItem("access", data.access);
    return data.access;
  } catch (error) {
    // refresh-токен не подошёл — сессия закончилась, выходим из аккаунта
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 401)
    ) {
      clearAuth();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      throw new ApiError(SESSION_EXPIRED, 401);
    }
    throw error;
  }
};

// Обёртка для запросов с авторизацией:
// при 401 обновляет токен и повторяет запрос с новым токеном
export async function withReAuth<T>(
  action: (access: string) => Promise<T>,
): Promise<T> {
  try {
    return await action(getAccess());
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      const newAccess = await refreshAccess();
      return action(newAccess);
    }
    throw error;
  }
}
