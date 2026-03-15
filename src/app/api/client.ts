/**
 * API client for Be backend. Base URL: VITE_API_URL or http://127.0.0.1:8000
 */

import type {
  AuthVerifyResponse,
  AuctionState,
  AuctionMeResponse,
  PlaceBidResponse,
  ApiErrorBody,
  ApiErrorDetail,
} from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function getAuthHeaders(token: string | null): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Normalize API error detail to a single string for display */
export function getErrorMessage(body: ApiErrorBody): string {
  const d = body.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d) && d.length > 0) {
    const first = d[0];
    if (first && typeof first === "object" && "msg" in first) return first.msg;
  }
  return "Something went wrong.";
}

async function handleResponse<T>(res: Response, parseJson = true): Promise<T> {
  const body = parseJson ? ((await res.json()) as ApiErrorBody | T) : null;
  if (!res.ok) {
    const message = body && "detail" in body ? getErrorMessage(body as ApiErrorBody) : res.statusText;
    throw new Error(message);
  }
  return body as T;
}

/** POST /auth/request_otp */
export async function requestOtp(email: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/auth/request_otp`, {
    method: "POST",
    headers: getAuthHeaders(null),
    body: JSON.stringify({ email }),
  });
  return handleResponse<{ message: string }>(res);
}

/** POST /auth/verify_otp */
export async function verifyOtp(email: string, otp: string): Promise<AuthVerifyResponse> {
  const res = await fetch(`${BASE_URL}/auth/verify_otp`, {
    method: "POST",
    headers: getAuthHeaders(null),
    body: JSON.stringify({ email, otp }),
  });
  return handleResponse<AuthVerifyResponse>(res);
}

/** GET /auction/state */
export async function getAuctionState(): Promise<AuctionState> {
  const res = await fetch(`${BASE_URL}/auction/state`);
  return handleResponse<AuctionState>(res);
}

/** POST /auction/bid */
export async function placeBid(increment: number, token: string): Promise<PlaceBidResponse> {
  const res = await fetch(`${BASE_URL}/auction/bid`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ increment }),
  });
  return handleResponse<PlaceBidResponse>(res);
}

/** GET /auction/me */
export async function getAuctionMe(token: string): Promise<AuctionMeResponse> {
  const res = await fetch(`${BASE_URL}/auction/me`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleResponse<AuctionMeResponse>(res);
}
