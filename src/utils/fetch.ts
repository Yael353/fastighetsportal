import { logout } from "@/features/slices/authSlice";
import { AppDispatch } from "@/features/store/store";
import { getAuthToken } from "./auth";

export const authFetch = async (
  url: string | URL | Request,
  init: RequestInit = {},
  dispatch: AppDispatch
): Promise<Response> => {
  const token = getAuthToken();


  if (!token) {
    console.error("No valid accessToken found. Logging out...");
    dispatch(logout());
    throw new Error("No access token. You have been logged out.");
  }

  // Kontrollera token expiration om du sparar expiresAt i localStorage
  const expiresAt = Number(localStorage.getItem("expiresAt")) || 0;
  if (expiresAt && expiresAt - Date.now() < 0) {
    console.warn("Token has expired. Logging out...");
    dispatch(logout());
    throw new Error("Auth token expired.");
  }

  // Hantera headers
  const existingHeaders =
    init.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : Array.isArray(init.headers)
      ? Object.fromEntries(init.headers)
      : init.headers || {};

  const headers: Record<string, string> = {
    ...existingHeaders,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  console.log("Request headers:", headers);

  const options: RequestInit = {
    ...init,
    headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        console.warn("Unauthorized or expired token. Logging out...");
        dispatch(logout());
      }
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error in authFetch:", error);
    throw error;
  }
};
