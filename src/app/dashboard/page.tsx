import { PropertyList } from "../components/PropertyList";
import { getAuthToken } from "@/utils/auth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen flex flex-col bg-gray-900 pt-3 justify-center items-center">
        <h1
          className="text-3xl font-bold w-[33%] text-white p-3 pt-3 mx-4 flex justify-center items-center 
             bg-gray-700 
             rounded-xl shadow-lg
             tracking-wide"
        >
          Fastighetsöversikt
        </h1>

        <div className="flex-grow w-full">
          <PropertyList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
