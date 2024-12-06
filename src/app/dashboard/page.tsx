import { PropertyList } from "../components/PropertyList";
import { getAuthToken } from "@/utils/auth";

export default function DashboardPage() {
  const token = getAuthToken();
  const auth = {
    jwtData: { token }, // Skapa en minimal representation av auth
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold p-4">Fastighetsöversikt</h1>
      <div className="flex-grow">
        <PropertyList />
      </div>
    </div>
  );
}
