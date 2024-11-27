import { logout } from "@/features/slices/authSlice";
import { AppDispatch, RootState } from "@/features/store/store";

export const authFetch = async (
  input: string | URL | globalThis.Request,
  options: RequestInit,
  getState: () => RootState, // Typa korrekt
  dispatch: AppDispatch // För att kunna dispatcha actions
): Promise<Response> => {
  const authState = getState().auth; // Hämta auth-slice från state

  if (!authState.token) {
    throw new Error("No token available");
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    Authorization: `Bearer ${authState.token}`, // Lägg till token som Authorization-header
  };

  let response = await fetch(input, { ...options, headers });

  if (response.status === 401) {
    dispatch(logout()); // Dispatcha logout om token är ogiltig
    throw new Error("Token expired or unauthorized");
  }

  return response;
};
