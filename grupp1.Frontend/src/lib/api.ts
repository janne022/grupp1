// Generic error class for api
export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, details: unknown) {
    super(`Request failed with status ${status}`);

    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

// Generic http methods for better typing
export const apiClient = {
  get: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "PUT" }),
  patch: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH" }),
  delete: <T>(path: string, options?: ApiOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};

// Generic options for apiFetch. Includes stuff like method and headers inside RequestInit
type ApiOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
  body?: BodyInit | null;
};

// Generic fetch function for api
export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { json, body, headers: customHeaders, ...fetchOptions } = options;

  if (json !== undefined && body !== undefined) {
    throw new Error(
      "Cannot specify both 'json' and 'body' in apiFetch options",
    );
  }

  const headers = new Headers(customHeaders);

  const httpMethod = options.method?.toUpperCase() ?? "GET";

  headers.set("Accept", "application/json");

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, {
    ...fetchOptions,
    method: httpMethod,
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
  });

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  if (!response.ok) {
    throw new ApiError(response.status, await response.json());
  }

  return response.json() as Promise<T>;
}
