import { PropertyList } from "../components/PropertyList";
import { getAuthToken } from "@/utils/auth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen flex flex-col">
        <h1
          className="text-3xl font-bold p-6 mx-2 flex justify-center items-center 
             text-blue-700 bg-gradient-to-r from-blue-100 to-blue-300 
             rounded-xl shadow-lg border border-blue-300 
             tracking-wide"
        >
          Fastighetsöversikt
        </h1>

        <div className="flex-grow pt-4">
          <PropertyList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
