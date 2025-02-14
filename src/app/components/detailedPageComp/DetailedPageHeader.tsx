"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { FaHome } from "react-icons/fa";
import { ArrowUpIcon, Clock } from "lucide-react";
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

const deliveryRequestsData = [
  { value: 30 },
  { value: 40 },
  { value: 45 },
  { value: 50 },
  { value: 55 },
];

const assignedDeliveriesData = [
  { value: 50 },
  { value: 45 },
  { value: 30 },
  { value: 20 },
  { value: 10 },
];

const completedDeliveriesData = [
  { value: 10 },
  { value: 20 },
  { value: 30 },
  { value: 40 },
  { value: 50 },
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
    latestIAT,
    latestOAT, // Utomhustemperatur
    latestFWT, // Framledningstemperatur
    latestRWT,
    latestIATTime, // Tidpunkt för senaste IAT-värde
    latestOATTime, // Tidpunkt för senaste OAT-värde
    latestFWTTime, // Tidpunkt för senaste FWT-värde
    latestRWTTime, // Tidpunkt för senaste RWT-värde
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              INOMHUS TEMPERATUR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {latestIAT !== null ? latestIAT.toFixed(1) + "°C" : "N/A"}
                </div>

                {/* <p className="text-xs text-muted-foreground">
                  <span className="flex items-center text-green-500">
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                    12
                  </span>
                  up from yesterday
                </p> */}
              </div>
              <ChartContainer className="h-12 w-[100px]">
                <BarChart data={deliveryRequestsData}>
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              UTOMHUS TEMPERATUR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {latestOAT !== null ? latestOAT.toFixed(1) + "°C" : "N/A"}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">2</span> on the way to pick
                </p> */}
              </div>
              <ChartContainer className="h-12 w-[100px]">
                <BarChart data={assignedDeliveriesData}>
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              FRAMLEDNINGS TEMPERATUR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {latestFWT !== null ? latestFWT.toFixed(1) + "°C" : "N/A"}
                </div>
                <div className="h-4" />
              </div>
              <ChartContainer className="h-12 w-[100px]">
                <BarChart data={assignedDeliveriesData}>
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--chart-1))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              RETURLEDNINGS TEMPERATUR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">
                  {latestRWT !== null ? latestRWT.toFixed(1) + "°C" : "N/A"}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  
                  avg late
                </p> */}
              </div>
              <ChartContainer className="h-12 w-[100px]">
                <BarChart data={completedDeliveriesData}>
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--chart-2))"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
