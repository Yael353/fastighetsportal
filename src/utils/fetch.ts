import { AuthContentData } from "@/features/models/auth";

export const authFetch = async (
  url: string | URL | Request,
  init: RequestInit = {},
  auth: AuthContentData
): Promise<Response> => {
  if (!auth.jwtData) {
    throw new Error("No JWT Data");
  }

  if (auth.jwtData.expiresAt - Date.now() < 0) {
    await auth.logout();
    throw new Error("Auth Expired");
  }

  // Konvertera headers till Record<string, string> om det behövs
  const existingHeaders =
    init.headers instanceof Headers
      ? Object.fromEntries(init.headers.entries())
      : Array.isArray(init.headers)
      ? Object.fromEntries(init.headers)
      : init.headers || {};

  const headers: Record<string, string> = {
    ...existingHeaders,
    Authorization: `Bearer ${auth.jwtData.accessToken}`,
  };

  const options: RequestInit = {
    ...init,
    headers,
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Fetch failed with status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error in authFetch:", error);
    throw error;
  }
};
