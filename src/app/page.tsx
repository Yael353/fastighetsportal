import { LoginForm } from "@/app/components/login-form";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <LoginForm />
      </div>
    </ProtectedRoute>
  );
}
