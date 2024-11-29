import { logout } from "@/features/slices/authSlice";
import { AppDispatch, RootState } from "@/features/store/store";

export const authFetch = async (
  input: string | URL | globalThis.Request,
  init: RequestInit,
  getState: () => RootState, // Hämtar global state
  dispatch: AppDispatch // Redux dispatch för att utföra logout
): Promise<Response> => {
  const authState = getState().auth;

  // Kontrollera att token finns
  if (!authState.token) {
    throw new Error("No token available");
  }

  // Kontrollera om token är föråldrad
  const tokenExpiresAt = authState.account?.expiresAt ?? 0;
  if (tokenExpiresAt - Date.now() < 0) {
    dispatch(logout());
    throw new Error("Auth Expired");
  }

  // Förbered headers med Authorization
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
    Authorization: `Bearer ${authState.token}`,
  };

  // Utför fetch
  const response = await fetch(input, { ...init, headers });

  // Hantera obehörigt svar (401)
  if (response.status === 401) {
    dispatch(logout());
    throw new Error("Token expired or unauthorized");
  }

  return response;
};
