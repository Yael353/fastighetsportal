import { PropertyList } from "../components/PropertyList";
import { getAuthToken } from "@/utils/auth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen flex flex-col">
        <h1 className="text-3xl font-bold p-4">Fastighetsöversikt</h1>
        <div className="flex-grow">
          <PropertyList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
