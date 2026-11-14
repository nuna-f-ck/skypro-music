export const BASE_URL = "https://webdev-music-003b5b991590.herokuapp.com";

// Ошибка API: хранит HTTP-статус, чтобы можно было поймать 401
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Достаём понятный текст ошибки из ответа API
export const extractErrorMessage = (
  data: unknown,
  fallback: string,
): string => {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.detail === "string") return obj.detail;

    const parts = Object.values(obj).flatMap((value) => {
      if (Array.isArray(value)) return value.map(String);
      if (typeof value === "string") return [value];
      return [];
    });
    if (parts.length > 0) return parts.join(". ");
  }
  return fallback;
};

export const authHeader = (access: string): Record<string, string> => ({
  Authorization: `Bearer ${access}`,
});

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(BASE_URL + path, options);
  } catch {
    throw new ApiError(
      "Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.",
      0,
    );
  }

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(data, `Ошибка сервера (${response.status})`),
      response.status,
    );
  }

  return data as T;
}

export function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      // API требует этот заголовок (см. документацию)
      "content-type": "application/json",
    },
  });
}
