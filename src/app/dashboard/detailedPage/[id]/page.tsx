"use client";

import { useParams } from "next/navigation";

export default function DetailedPage() {
  const { id } = useParams(); // Hämta id från URL:en

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Detaljerad Sida</h1>
      <p className="text-lg">
        Sensor Domain ID: <strong>{id}</strong>
      </p>
    </div>
  );
}
