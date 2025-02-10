"use client";
import { useParams } from "next/navigation";

export default function ApartmentDetails() {
  const { id, apartmentId } = useParams();
  console.log("ID:", id, "Apartment ID:", apartmentId);

  return (
    <div>
      <h1>Detaljer för lägenhet {apartmentId}</h1>
      <p>Byggnad ID: {id}</p>
    </div>
  );
}
