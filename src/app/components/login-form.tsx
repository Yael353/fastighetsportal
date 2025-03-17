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
      <div className="flex justify-center items-center w-full h-screen relative">
        {/* Bakgrundsbilden */}
        <div
          className="absolute top-0 left-0 w-full opacity-50 h-full bg-cover bg-center z-0"
          style={{ backgroundImage: "url('images/loginbg.jpg')" }}
        ></div>

        <div className="relative w-[500px] h-auto z-10">
          <Card className="w-full mt-5 rounded-lg bg-darkBg/70 border border-neonBlue shadow-md shadow-neonBlue/30 transition-all">
            <CardHeader className="h-40 flex flex-col justify-center items-center w-full  text-white rounded-t-lg">
              <img
                src="images/logo.jpg"
                alt="logo"
                className="w-24 h-24 rounded-full border-2 border-neonBlue mb-2"
              />
              <CardTitle className="text-2xl font-semibold text-neonBlue">
                Logga in
              </CardTitle>
              <CardDescription className="text-gray-300">
                Webbportalen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isError && (
                <div className="flex justify-center items-center mt-4 p-4 mx-4 text-red-600 border border-red-500 rounded bg-red-50">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-6">
                  <div className="flex flex-col space-y-2 pt-10">
                    <Label
                      htmlFor="username"
                      className="text-gray-300 font-medium mt-4"
                    >
                      Användarnamn
                    </Label>
                    <div className="relative">
                      <User className="absolute left-2 top-3 h-5 w-5 text-neonBlue" />
                      <Input
                        id="username"
                        placeholder="Ange användarnamn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10 py-2 border border-neonBlue rounded-md focus:ring-2 focus:ring-neonBlue focus:outline-none  bg-darkBg/90"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-gray-300 font-medium"
                    >
                      Lösenord
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-3 h-5 w-5 text-neonBlue" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Ange lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 py-2 border border-neonBlue rounded-md focus:ring-2 focus:ring-neonBlue bg-darkBg/90 text-gray-200 focus:outline-none"
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
                    className="w-[50%] bg-neonBlue hover:bg-neonBlue/90 text-darkBg font-semibold transition-colors rounded-lg"
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
