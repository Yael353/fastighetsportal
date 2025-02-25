"use client";
import ApartmentScreen from "@/app/components/apartmentDetailes/ApartmentScreen";
import { useParams } from "next/navigation";

export default function ApartmentDetails() {
  const { id, apartmentId } = useParams();

  return (
    <div className="bg-gray-900 h-screen">
      <ApartmentScreen />
    </div>
  );
}
