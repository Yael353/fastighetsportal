"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { FaHome } from "react-icons/fa";
import { useSensorData } from "@/hooks/useSensorData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function DetailedPageHeader() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = useSearchParams();
  const router = useRouter();

  if (typeof id !== "string") {
    return <p>Ogiltigt ID: {JSON.stringify(id)}</p>;
  }

  const loading = useSelector((state: RootState) => state.property.loading);

  // 🆕 Hämta sensordata och undercentraler
  const {
    sensorList,
    controllers,
    selectedControllerId,
    setSelectedControllerId,
    propertyName,
  } = useSensorData(id);

  // 🆕 Hämta vald controller från URL:en (om den finns)
  const controllerFromUrl = searchParams.get("controller");

  // 🆕 Effekt för att sätta rätt controller vid sidladdning
  useEffect(() => {
    if (controllerFromUrl && controllers.includes(controllerFromUrl)) {
      setSelectedControllerId(controllerFromUrl);
    }
  }, [controllerFromUrl, controllers]);

  // 🆕 Uppdatera URL:en när en ny tab väljs
  const handleTabChange = (newController: string) => {
    setSelectedControllerId(newController);
    router.push(`?controller=${newController}`, { scroll: false });
  };

  // ✅ Hämta sensordomain-data när komponenten mountar
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [id, dispatch]);

  return (
    <div className="bg-darkBg px-4 w-full">
      <Card className="bg-darkBg border-none p-4">
        <div className="flex items-center justify-center mt-4 gap-5">
          <CardTitle className="text-5xl bg-darkBg font-bold text-white tracking-wide first-letter:uppercase">
            {loading ? (
              <Loader2 className="inline h-6 w-6 animate-spin text-blue-500" />
            ) : (
              propertyName
            )}
          </CardTitle>
          <FaHome size={48} />
        </div>
      </Card>

      {/* 🆕 Tabs för undercentraler */}
      {controllers.length > 1 && (
        <div className="flex w-full justify-center py-2">
          <Tabs
            className="justify-center"
            value={selectedControllerId}
            onValueChange={handleTabChange}
          >
            <TabsList className="flex bg-darkBg gap-2 p-1 rounded-lg">
              {controllers.map((controller, index) => (
                <TabsTrigger
                  key={controller}
                  value={controller}
                  className="tab-style bg-gray-800"
                >
                  {`Undercentral ${index + 1}`}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* 🆕 Dynamiskt genererade kort */}
      <div className="flex flex-wrap gap-4 py-4 pb-10 justify-start [&>*]:w-[calc(25%-1rem)]">
        {sensorList.map(({ title, value, data }, index) => (
          <Card
            key={index}
            className="flex flex-row bg-darkBg items-center justify-between px-4 w-full max-w-xl h-24 rounded-lg shadow-md border border-neonBlue"
          >
            <div className="flex flex-col justify-center">
              <CardTitle className="text-xs font-medium text-gray-400">
                {title}
              </CardTitle>
              <div className="text-4xl font-bold text-gray-200">
                {value !== null ? (
                  value.toFixed(1) + "°C"
                ) : (
                  <Loader2 className="animate-spin w-6 h-6" />
                )}
              </div>
            </div>
            <div className="w-[130px] 2xl:w-[300px]">
              <ChartContainer className="h-16 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#00699f"
                      strokeWidth={3}
                      dot={false}
                    />
                    <YAxis hide />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || payload.length === 0) {
                          return null;
                        }

                        const value = payload[0]?.value;

                        return (
                          <div className="bg-[#0A192F] border border-blue-500 rounded-md p-2 text-white text-sm shadow-lg">
                            {typeof value === "number"
                              ? `${value.toFixed(2)} °C`
                              : value}
                          </div>
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
