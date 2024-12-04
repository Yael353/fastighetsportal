export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    console.log("Retrieved token from localStorage:", token); // För felsökning
    return token;
  }
  return null;
};
