export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    return token;
  }
  return null;
};
