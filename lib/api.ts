const API_BASE = "/api";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("nc_token") || "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("nc_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro na requisição");
  return data as T;
}

export const api = {
  get:    <T>(path: string) => apiFetch<T>(path),
  post:   <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
