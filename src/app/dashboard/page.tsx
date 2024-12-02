import { PropertyList } from "../components/PropertyList"
export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold p-4">Fastighetsöversikt</h1>
      <div className="flex-grow">
        <PropertyList />
      </div>
    </div>
  )
}
