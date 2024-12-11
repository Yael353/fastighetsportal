"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/features/store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isLoggedIn, hasInitiatedLocalAccount } = useSelector(
    (state: RootState) => state.auth
  );

  // Funktion för att validera access token
  const validateToken = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodera token
      const expiresAt = decodedToken.exp * 1000; // Expiry-tid i millisekunder
      return expiresAt > Date.now(); // Kontrollera om token fortfarande är giltig
    } catch (error) {
      console.error("Tokenvalidering misslyckades:", error);
      return false;
    }
  };

  // Lyssna på storage-event för synkronisering mellan flikar
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === "accessToken" && event.newValue) {
        console.log("Access token har ändrats, synkar inloggning.");
        router.push("/dashboard");
      } else if (event.key === "logout") {
        console.log("Utloggning har skett i en annan tab");
        router.push("/");
      }
    };

    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [router]);

  // Validera token vid komponentens första rendering
  useEffect(() => {
    if (!validateToken()) {
      console.log("Token är ogiltig eller har löpt ut, loggar ut användaren.");
      localStorage.setItem("logout", Date.now().toString());
      router.push("/");
    }
  }, [router]);

  // Sätt en timer för automatisk utloggning när token löper ut
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expiresAt = decodedToken.exp * 1000;
        const timeLeft = expiresAt - Date.now();

        if (timeLeft <= 0) {
          console.log("Token har redan löpt ut. Loggar ut användaren.");
          localStorage.setItem("logout", Date.now().toString());
          router.push("/");
        } else {
          const timeout = setTimeout(() => {
            console.log("Token har löpt ut. Loggar ut användaren.");
            localStorage.setItem("logout", Date.now().toString());
            router.push("/");
          }, timeLeft);

          return () => clearTimeout(timeout); // Rensa timeout vid unmount
        }
      } catch (error) {
        console.error("Fel vid hantering av token-expiration:", error);
        localStorage.setItem("logout", Date.now().toString());
        router.push("/");
      }
    }
  }, [router]);

  // Visa laddningsskärm om användaren inte är initierad
  // if (!hasInitiatedLocalAccount) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p className="text-lg font-semibold">Laddar användarkonto...</p>
  //     </div>
  //   );
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
