"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const SESSION_TIMEOUT = 60 * 60 * 1000;

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionExpired, setSessionExpired] = useState(false);

  const resetActivityTimer = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resetActivityTimer);
    window.addEventListener("keydown", resetActivityTimer);
    window.addEventListener("click", resetActivityTimer);
    return () => {
      window.removeEventListener("mousemove", resetActivityTimer);
      window.removeEventListener("keydown", resetActivityTimer);
      window.removeEventListener("click", resetActivityTimer);
    };
  }, [resetActivityTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > SESSION_TIMEOUT) {
        setSessionExpired(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  // Tokenvalidering
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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    handleNavigation(validateToken(token));
  }, []);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!validateToken(localStorage.getItem("accessToken"))) {
        localStorage.removeItem("accessToken");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // När sessionen har löpt ut, visa ett meddelande och omdirigera efter kort stund
  useEffect(() => {
    if (sessionExpired) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("accessToken");
        localStorage.setItem("logoutEvent", Date.now().toString());
        router.replace("/");
        router.refresh();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [sessionExpired, router]);

  if (isValidating) {
    return <div className="bg-darkBg h-screen w-full"></div>;
  }

  return (
    <>
      {sessionExpired && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center p-4 z-50">
          Sessionen har löpt ut. Du kommer att omdirigeras till inloggningen.
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
