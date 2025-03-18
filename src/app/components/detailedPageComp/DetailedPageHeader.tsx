"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { LineChart, Line, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { FaHome } from "react-icons/fa";
import { useSensorData } from "@/hooks/useSensorData";
import { Loader2 } from "lucide-react"; 
import moment from "moment";

export default function DetailedPageHeader() {
  const { id } = useParams(); // Hämta ID från URL
  const dispatch = useDispatch<AppDispatch>();

  if (typeof id !== "string") {
    return <p>Ogiltigt ID: {JSON.stringify(id)}</p>;
  }

  const { sensorList } = useSensorData(id); // 🆕 En lista med alla sensorer och deras data

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

  const { name } = data;

  return (
    <div className="bg-darkBg px-4 w-full">
      {/* Property Information */}
      <Card className="bg-darkBg border-none p-4">
        <div className="flex items-center justify-center mt-4 gap-5">
          <CardTitle className="text-5xl bg-darkBg font-bold text-white tracking-wide first-letter:uppercase">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </CardTitle>
          <FaHome size={48} />
        </div>
      </Card>

      {/* 🔹 FLEX med WRAP för att hantera flera kort dynamiskt */}
      <div className="flex flex-wrap gap-4 py-4 pb-10 justify-center [&>*]:w-[calc(25%-1rem)]">
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
                  <Loader2 className="h-10 w-10 text-gray-200 animate-spin" />
                )}
              </div>
            </div>
            <div className="">
              <ChartContainer className="h-16 w-[130px] 2xl:w-[300px]">
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
                  labelFormatter={(label) => moment(label).format("YY-MM-DD HH:mm")}
                  position={{ y: 60 }}
                    formatter={(value: number) => `${value.toFixed(2)}°C`}
                    contentStyle={{
                      backgroundColor: "#001220", // Bakgrundsfärg
                      borderColor: "#00BFFF", // Ramfärg
                      color: "#fff", // Textfärg
                      borderRadius: "8px", // Rundade kanter
                      padding: "10px", // Padding för bättre spacing
                      fontSize: "14px", // Justera textstorlek
                      fontWeight: "bold", // Fetstilt text
                    }}                  
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
