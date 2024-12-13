"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { authenticateUser } from "@/features/slices/authSlice";
import { AppDispatch } from "@/features/store/store";
import { User, Lock, Loader2 } from "lucide-react";
import { AuthCredentials } from "@/features/models/auth";
import ProtectedRoute from "./ProtectedRoute";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Hanterar inloggningsformuläret
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    // Skapa credentials-objektet för autentisering
    const credentials: AuthCredentials = {
      user: username,
      password,
    };

    try {
      const response = await dispatch(authenticateUser(credentials)).unwrap();
      const accessToken = response.access_token;
      localStorage.setItem("accessToken", accessToken);

      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      setIsLoading(false);
      setIsError(true);

      const message =
        error?.message || "Fel användarnamn eller lösenord, försök igen!";
      setErrorMessage(message);

      setTimeout(() => {
        setIsError(false);
        setErrorMessage("");
      }, 5000);
    }
  };

  return (
    <ProtectedRoute>
      <Card className={`w-[350px] ${isError ? "animate-shake" : ""}`}>
        <CardHeader>
          <CardTitle>Logga in</CardTitle>
          <CardDescription>Webbportalen</CardDescription>
        </CardHeader>
        <CardContent>
          {isError && (
            <div className="mb-4 p-2 text-red-500 border border-red-500 rounded">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Användarnamn</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Ange användarnamn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Lösenord</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ange lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-center p-4">
              <Button size="lg" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loggar in...
                  </>
                ) : (
                  "Logga in"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
}
