"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  // Funktion för att validera token
  const validateToken = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodera JWT-token
      const expiresAt = decodedToken.exp * 1000; // Expiry-tid i millisekunder
      return expiresAt > Date.now(); // Kontrollera om token fortfarande är giltig
    } catch (error) {
      console.error("Tokenvalidering misslyckades:", error);
      return false;
    }
  };

  // Validera token vid första rendering
  useEffect(() => {
    const tokenIsValid = validateToken();
    if (tokenIsValid) {
      router.push("/dashboard");
    } else {
      localStorage.setItem("logout", Date.now().toString());
      router.push("/");
    }
  }, [router]);

  //Lyssna på storage-event för att synkronisera mellan flikar
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "accessToken" && event.newValue) {
        router.push("/dashboard");
      } else if (event.key === "logout") {
        router.push("/");
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
