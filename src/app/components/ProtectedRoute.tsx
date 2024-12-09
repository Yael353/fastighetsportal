"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/features/store/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isLoggedIn, hasInitiatedLocalAccount } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    if (!token || !isLoggedIn) {
      console.log("Ingen giltig access token hittades, omdirigerar till /...");
      router.push("/");
    } else if (token) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
