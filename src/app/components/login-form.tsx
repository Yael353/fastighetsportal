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
import { fetchUserFromToken } from "@/features/slices/authSlice"; // Importera fetchUserFromToken
import { AppDispatch } from "@/features/store/store";
import { User, Lock } from "lucide-react";
import { AuthCredentials } from "@/features/models/auth";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const credentials: AuthCredentials = {
      user: username,
      password,
    };

    dispatch(fetchUserFromToken(credentials))
      .unwrap()
      .then(() => {
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Inloggning misslyckades: ", error);
      });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Logga in</CardTitle>
        <CardDescription>Webbportalen</CardDescription>
      </CardHeader>
      <CardContent>
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
          <CardFooter className="flex justify-between">
            <Button variant="outline">Avbryt</Button>
            <Button type="submit">Logga in</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
