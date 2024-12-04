import { logout } from "@/features/slices/authSlice";
import { AppDispatch, RootState } from "@/features/store/store";
import { getAuthToken } from "./auth";

export const authFetch = async (
  url: string,
  options: RequestInit,
  getState: () => RootState,
  dispatch: AppDispatch
): Promise<Response> => {
  const token = getAuthToken(); // Hämta token från localStorage

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const updatedOptions = {
    ...options,
    headers: headers,
  };

  try {
    const response = await fetch(url, updatedOptions);
    return response;
  } catch (error) {
    console.error("API-fel:", error);
    throw error;
  }
};
