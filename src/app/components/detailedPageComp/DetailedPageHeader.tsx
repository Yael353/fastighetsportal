"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { FaHome } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSensorData } from "@/hooks/useSensorData";

// Mock data för månatlig beläggning
const occupancyData = [
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 94 },
  { month: "Mar", rate: 95 },
  { month: "Apr", rate: 95 },
  { month: "Maj", rate: 96 },
  { month: "Jun", rate: 95 },
];

export default function DetailedPageHeader() {
  const { id } = useParams(); // Hämta ID från URL
  const dispatch = useDispatch<AppDispatch>();

  const {
    chartDataOAT,
    chartDataIAT,
    chartDataFWT,
    chartDataRWT,
    filteredOAT,
    filteredIAT,
    filteredFWT,
    filteredRWT,
  } = useSensorData(id);

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
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=700x200&maptype=roadmap&markers=color:red|${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return (
    <div className="">
      {/* Static Satellite Map */}
      <div className="">
        <img
          src={staticMapUrl}
          alt="Static roadmap"
          className="rounded-md sm:w-[100%] 2xl:w-[100%] h-[450px]"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0) 90%)",
          }}
        />
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
      <div className="flex flex-row gap-2 overflow-x-auto w-full">
        <Card className="flex-1 min-w-[250px]">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Outdoor air temperature</CardTitle>
            {/* <CardDescription>Beläggningsgrad över tid</CardDescription> */}
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartDataOAT}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {filteredOAT.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={sensor.id}
                    stroke="#28a745"
                    name={sensor.name}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[250px]">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Forward water temperature</CardTitle>
            {/* <CardDescription>Beläggningsgrad över tid</CardDescription> */}
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartDataFWT}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {filteredFWT.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={sensor.id}
                    stroke="#6f42c1"
                    name={sensor.name}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[250px]">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Indoor air temperature</CardTitle>
            {/* <CardDescription>Beläggningsgrad över tid</CardDescription> */}
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartDataIAT}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {filteredIAT.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={sensor.id}
                    stroke="#dc3545"
                    name={sensor.name}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[250px]">
          <CardHeader className="p-4">
            <CardTitle className="text-lg">Return water temperature</CardTitle>
            {/* <CardDescription>Beläggningsgrad över tid</CardDescription> */}
          </CardHeader>
          <CardContent className="p-2">
            <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartDataRWT}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {filteredRWT.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={sensor.id}
                    stroke="#007bff"
                    name={sensor.name}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
