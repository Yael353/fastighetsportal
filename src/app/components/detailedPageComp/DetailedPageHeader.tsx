"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, YAxis, Tooltip } from "recharts"; // Importera Tooltip
import { ChartContainer } from "@/components/ui/chart";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { FaHome } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSensorData } from "@/hooks/useSensorData";
import SensorDataComp from "./SensorDataComp";

// Typer för sensordata
interface SensorData {
  value: number;
}

interface Domain {
  min: number;
  max: number;
}

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
    latestIAT,
    latestOAT,
    latestFWT,
    latestRWT,
    latestIATTime,
    latestOATTime,
    latestFWTTime,
    latestRWTTime,
    barChartDataIAT,
    barChartDataOAT,
    barChartDataFWT,
    barChartDataRWT,
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

  // Beräkna domain för BarChart
  const calculateDomain = (data: SensorData[]): [number, number] => {
    if (!data || data.length === 0) return [0, 0];

    const values = data.map((item) => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    // Lägg till en marginal på 10% av intervallet
    const margin = (maxValue - minValue) * 0.1;

    // Säkerställ att minValue inte blir negativ om margin är större än minValue
    const adjustedMin = Math.max(minValue - margin, 0);

    return [adjustedMin, maxValue + margin];
  };

  // Använd calculateDomain för att sätta domain för varje BarChart
  const domains = [
    calculateDomain(barChartDataIAT),
    calculateDomain(barChartDataOAT),
    calculateDomain(barChartDataFWT),
    calculateDomain(barChartDataRWT),
  ];

  // Hantering av olika tillstånd
  if (loading) return <p>Loading property data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No property data found for ID: {id}</p>;

  const { name, location } = data;

  // Bygg URL för den statiska kartan med satellitbild
  const staticMapUrl = location
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=15&size=300x300&maptype=satellite&markers=color:blue|${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    : "";

  return (
    <div className="bg-gray-900 p-4 w-full">
      {/* Property Information */}
      <Card className="bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-center gap-x-5">
            <CardTitle className="text-3xl bg-gray-900 font-bold text-white tracking-wide first-letter:uppercase">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </CardTitle>
            <FaHome size={30} />
          </div>
        </CardHeader>
      </Card>

      {/* Höger sida: Kartan */}
      <div className="flex justify-center">
        {location && (
          <div className="w-[35%] h-full">
            <img
              src={staticMapUrl}
              alt="Static satellite"
              className="rounded-sm w-full h-full object-cover"
              style={{
                maskImage:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0) 80%)",
              }}
            />
          </div>
        )}
      </div>

      {/* Layout med kort och karta */}
      <div className="flex flex-row gap-3">
        {[
          {
            title: "INOMHUS TEMPERATUR",
            value: latestIAT,
            data: barChartDataIAT,
            domain: domains[0],
          },
          {
            title: "UTOMHUS TEMPERATUR",
            value: latestOAT,
            data: barChartDataOAT,
            domain: domains[1],
          },
          {
            title: "FRAMLEDNINGS TEMPERATUR",
            value: latestFWT,
            data: barChartDataFWT,
            domain: domains[2],
          },
          {
            title: "RETURLEDNINGS TEMPERATUR",
            value: latestRWT,
            data: barChartDataRWT,
            domain: domains[3],
          },
        ].map(({ title, value, data, domain }, index) => (
          <Card
            key={index}
            className="flex flex-row items-center justify-between p-4 w-full max-w-xl h-24 rounded-lg shadow-md border border-gray-700"
          >
            <div className="flex flex-col justify-center">
              <CardTitle className="text-xs font-medium text-gray-400">
                {title}
              </CardTitle>
              <div className="text-4xl font-bold text-gray-200">
                {value !== null ? value.toFixed(1) + "°C" : "N/A"}
              </div>
            </div>
            <ChartContainer className="h-16 w-[150px]">
              <BarChart data={data}>
                <Bar dataKey="value" fill="#00699f" radius={[2, 2, 0, 0]} />
                <YAxis domain={domain} hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                  formatter={(value) => `${value}°C`}
                />
              </BarChart>
            </ChartContainer>
          </Card>
        ))}
      </div>

      {/* <div className="w-full">
        <SensorDataComp />
      </div> */}
    </div>
  );
}
