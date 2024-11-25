// import { AuthContentData } from "@/contexts/AuthContext";

// export const authFetch = async (
//   input: string | URL | globalThis.Request,
//   auth: AuthContentData,
//   init: RequestInit
// ): Promise<Response> => {
//   if (!auth.jwtData) {
//     throw "No JWT Data";
//   }
//   if (auth.jwtData.expiresAt - Date.now() < 0) {
//     await auth.logout();
//     throw "Auth Expired";
//   }

//   const options = init;
//   const headers: Record<string, string> =
//     (options.headers as Record<string, string>) ?? {};
//   headers["Authorization"] = `Bearer ${auth.jwtData?.accessToken}`;

//   const response = await fetch(input, options);
//   return response;
// };
