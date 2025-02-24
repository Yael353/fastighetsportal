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

      // Anpassa till AccessTokenData-strukturen
      const accessTokenData = { accessToken: response.access_token };

      localStorage.setItem("accessToken", accessTokenData.accessToken);
      localStorage.setItem("account", JSON.stringify(response.account));

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
      <div className="flex justify-center items-center w-full min-h-screen bg-white">
        <div className="relative w-[500px] h-auto">
          <img
            src="images/logo.jpg"
            alt="logo"
            className="absolute z-50 -top-12 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-blue-800"
          />
          <Card
            className={`w-full mt-10 shadow-lg rounded-lg bg-white ${
              isError
                ? "animate-shake border border-gradient-to-r m-4 from-blue-200 to-blue-800"
                : "border border-gray-200"
            }`}
          >
            <CardHeader className="text-center bg-gradient-to-r from-blue-400 to-blue-800 text-white rounded-t-lg pt-12">
              <CardTitle className="text-2xl font-semibold">Logga in</CardTitle>
              <CardDescription className="text-yellow-50">
                Webbportalen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isError && (
                <div className="m-4 p-4 text-red-600 border border-red-500 rounded bg-red-50">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-6">
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-gray-700 font-medium mt-4"
                    >
                      Användarnamn
                    </Label>
                    <div className="relative">
                      <User className="absolute left-2 top-3 h-5 w-5 text-blue-400" />
                      <Input
                        id="username"
                        placeholder="Ange användarnamn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-700 font-medium"
                    >
                      Lösenord
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-3 h-5 w-5 text-blue-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Ange lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 text-black focus:outline-none transition-shadow"
                        required
                      />
                    </div>
                  </div>
                </div>
                <CardFooter className="flex justify-center p-4">
                  <Button
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="w-[50%] bg-blue-400 hover:bg-blue-500 text-white font-semibold transition-colors rounded-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
