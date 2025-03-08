"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  // Funktion för att validera token
  const validateToken = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodera JWT-token
      const expiresAt = decodedToken.exp * 1000;

      return expiresAt > Date.now();
    } catch (error) {
      console.error("Tokenvalidering misslyckades:", error);
      return false;
    }
  };

  // Validera token vid första rendering
  useEffect(() => {
    const tokenIsValid = validateToken();
    if (tokenIsValid) {
      router.replace("/dashboard");
    } else {
      localStorage.setItem("logout", Date.now().toString());
      router.replace("/");
    }
    setIsValidating(false);
  }, [router]);

  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "accessToken" && event.newValue) {
        router.replace("/dashboard");
      } else if (event.key === "logout") {
        router.replace("/");
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [router]);

  if (isValidating) {
    return <div style={{ backgroundColor: "#111827", height: "100vh" }}></div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
