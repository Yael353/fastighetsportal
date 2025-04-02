"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  // Förbättrad tokenvalidering med try-catch och fallback
  const validateToken = (token: string | null): boolean => {
    if (!token) return false;

    try {
      const payload = token.split(".")[1];
      if (!payload) return false;

      const decoded = JSON.parse(atob(payload));
      const expiresAt = decoded.exp * 1000;
      return expiresAt > Date.now();
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  // Centraliserad navigeringshantering
  const handleNavigation = (tokenIsValid: boolean) => {
    if (tokenIsValid) {
      router.replace("/dashboard");
    } else {
      localStorage.removeItem("accessToken");
      localStorage.setItem("logoutEvent", Date.now().toString());
      router.replace("/");
      router.refresh();
    }
    setIsValidating(false);
  };

  // Huvudeffekt för initial validering
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    handleNavigation(validateToken(token));
  }, []); // Empty dependency array för att köras en gång

  // Hantera storage events och session mellan fliker/fönster
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        handleNavigation(validateToken(e.newValue));
      } else if (e.key === "logoutEvent") {
        handleNavigation(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Förhindra cachning av skyddade routes
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!validateToken(localStorage.getItem("accessToken"))) {
        localStorage.removeItem("accessToken");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Visa inget under validering (eller en laddningsindikator)
  if (isValidating) {
    return <div className="bg-darkBg h-screen w-full"></div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
