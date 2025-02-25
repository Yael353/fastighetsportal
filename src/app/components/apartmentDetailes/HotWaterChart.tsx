import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BatchSensorDataResponse } from "@/features/models/sensor-data";
import moment from "moment"; // Importera moment.js för att formatera tid i X-axeln och Tooltip
import { formatData } from "@/utils/date";

interface Props {
  batchData: BatchSensorDataResponse[] | null;
}

export default function HotWaterChart({ batchData }: Props) {
  if (!batchData)
    return <div>Ingen varmvattenförbrukningsdata tillgänglig</div>;

  // Filtrera ut alla VV-sensorer
  const allSensors = batchData.flatMap((res) => res.sensor_data);
  const vvSensors = allSensors.filter((sensor) => sensor.name.includes("VV"));

  // Omvandla data med formatData
  const vvChartData =
    vvSensors.length > 0
      ? formatData(
          vvSensors[0].data.map((entry) => ({
            time_utc: entry.time_utc,
            value: entry.value / 1000, // Omvandla till m³ istället för liter om så behövs
          }))
        )
      : [];

  return (
    <div className="bg-gray-700 shadow-md rounded-lg p-2">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={vvChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => moment(time).format("HH:mm")} // Visa endast timmar och minuter
          />
          <YAxis tickFormatter={(value) => value.toFixed(0)} />
          <Tooltip
            labelFormatter={(label) => moment(label).format("YYYY-MM-DD HH:mm")}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
