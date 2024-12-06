export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    console.log("Retrieved token from localStorage:", token);
    return token;
  }
  return null;
};
