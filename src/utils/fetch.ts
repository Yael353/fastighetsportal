import { AppDispatch, RootState } from "@/features/store/store";
import { getAuthToken } from "./auth";
import { logout } from "@/features/slices/authSlice";

export const authFetch = async (
  url: string,
  options: RequestInit,
  getState: () => RootState,
  dispatch: AppDispatch
): Promise<Response> => {
  const token = getAuthToken();

  // Automatiskt lägg till Authorization-header om token finns
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const updatedOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, updatedOptions);

    // Hantera felkoder globalt, exempelvis 401
    if (response.status === 401) {
      console.warn("Unauthorized - token might be expired. Logging out...");
      dispatch(logout());
    } else if (!response.ok) {
      console.error(`Request failed with status: ${response.status}`);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
};
