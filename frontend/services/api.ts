export type WorkType = "individuel" | "groupe";

export interface BadgePayload {
  nom: string;
  prenom: string;
  age: number;
  date_naissance: string;
  lieu_naissance: string;
  telephone: string;
  contact_urgence: string;
  contact_urgence_numero: string;
  contact_membre_urgence: string;
  contact_membre_urgence_numero: string;
  nationalite: string;
  profession: string;
  type_travail: WorkType;
  employeur_nom?: string | null;
  employeur_prenom?: string | null;
  photo_base64?: string | null;
  adresse: string;
}

export interface BadgeResponse extends BadgePayload {
  id: number;
  created_at: string;
}

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_BASE_URL = "http://localhost:8000/api";


function getApiBaseUrl(): string {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname === "localhost" ? "127.0.0.1" : window.location.hostname;
    return `${window.location.protocol}//${host}:8000/api`;
  }
  return "http://localhost:8000/api";
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error("Impossible de joindre l API. Verifie que le backend est demarre.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({} as { detail?: string }));
    const detail =
      payload.detail ??
      (response.status >= 500 ? "Erreur interne du serveur." : "Requete invalide.");
    throw new Error(detail);
  }

  return (await response.json()) as T;
}

export async function login(username: string, password: string): Promise<string> {
  const payload = await request<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password })
  });
  return payload.access_token;
}

export async function createBadge(payload: BadgePayload, token: string): Promise<BadgeResponse> {
  return request<BadgeResponse>(
    "/badges",
    {
      method: "POST",
      body: JSON.stringify(payload)
    },
    token
  );
}

export async function listBadges(token: string): Promise<BadgeResponse[]> {
  return request<BadgeResponse[]>("/badges", { method: "GET" }, token);
}

export async function getBadgeById(badgeId: number, token: string): Promise<BadgeResponse> {
  return request<BadgeResponse>(`/badges/${badgeId}`, { method: "GET" }, token);
}

export async function updateBadgeById(
  badgeId: number,
  payload: BadgePayload,
  token: string
): Promise<BadgeResponse> {
  return request<BadgeResponse>(
    `/badges/${badgeId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload)
    },
    token
  );
}
