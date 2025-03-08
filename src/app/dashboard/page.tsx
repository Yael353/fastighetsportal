import { PropertyList } from "../components/PropertyList";
import { getAuthToken } from "@/utils/auth";
import ProtectedRoute from "../components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen flex flex-col bg-darkBg pt-3 justify-center items-center">
        <h1
          className="text-3xl font-bold px-10 text-neonBlue p-3 mx-4 flex justify-center items-center 
       bg-darkBg/80 border border-neonBlue rounded-xl shadow-lg shadow-neonBlue/50
       tracking-wide transition-transform hover:scale-105 duration-200"
        >
          Fastighetsöversikt
        </h1>

        <div className="flex-grow w-full bg-darkBg">
          <PropertyList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
