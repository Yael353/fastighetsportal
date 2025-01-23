"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { FaHome } from "react-icons/fa";

export default function DetailedPageHeader() {
  const { id } = useParams(); // Hämta ID från URL
  const dispatch = useDispatch<AppDispatch>();

  // Hämta sensordomain-data från Redux-storen
  const { data, loading, error } = useSelector(
    (state: RootState) => state.property
  );

  // Hämta sensordomain-data när komponenten mountar
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [id, dispatch]);

  // Hantering av olika tillstånd
  if (loading) return <p>Loading property data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No property data found for ID: {id}</p>;

  const { name, location } = data;

  // Bygg URL för den statiska kartan med satellitbild
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=16&size=600x200&maptype=roadmap&markers=color:red|${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className="">
      {/* Static Satellite Map */}
      <div className="w-full flex justify-center">
        <img
          src={staticMapUrl}
          alt="Static roadmap"
          className="rounded-md w-full sm:w-[90%] 2xl:w-[95%] h-[350px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0) 90%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent"></div>{" "}
      </div>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center gap-x-5">
            <CardTitle className="text-3xl font-bold text-gray-800 tracking-wide first-letter:uppercase">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </CardTitle>
            <FaHome size={30} />
          </div>
        </CardHeader>
      </Card>

      {/* Additional Information */}
      <Card className="mt-10 p-20">Tja</Card>
    </div>
  );
}
