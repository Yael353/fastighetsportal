import { logout } from "@/features/slices/authSlice";
import { AppDispatch } from "@/features/store/store";
import { getAuthToken } from "./auth";
import { RESPONSE_404 } from "@/features/errors/errors";

export const authFetch = async (
  url: string | URL | Request,
  init: RequestInit = {},
  dispatch: AppDispatch
): Promise<Response> => {
  const token = getAuthToken();

  if (!token) {
    dispatch(logout());
    throw new Error("No access token. You have been logged out.");
  }

  const expiresAt = Number(localStorage.getItem("expiresAt")) || 0;
  if (expiresAt && expiresAt - Date.now() < 0) {
    dispatch(logout());
    throw new Error("Auth token expired.");
  }

  const headers: HeadersInit = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options: RequestInit = {
    ...init,
    headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Specialhantering för auth-relaterade fel
      if (response.status === 401 || response.status === 403) {
        dispatch(logout());
        throw new Error(`Auth error: ${response.statusText}`);
      }
      // Returnera response som den är för andra fel (inklusive 404)
      return response;
    }

    return response;
  } catch (error) {
    // Endast logga oväntade fel
    if (!(error instanceof RESPONSE_404)) {
      console.error("Network error in authFetch:", error);
    }
    throw error;
  }
};
