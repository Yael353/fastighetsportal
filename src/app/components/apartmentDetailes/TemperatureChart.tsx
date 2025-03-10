import React from "react";
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
import { BatchSensorDataResponse } from "@/features/models/sensor-data";
import moment from "moment"; // Importera moment.js för att formatera X-axeln och Tooltip
import { formatData } from "@/utils/date";

interface Props {
  batchData: BatchSensorDataResponse[] | null;
}

export default function TemperatureChart({ batchData }: Props) {
  if (!batchData) return <div>Ingen temperaturdata tillgänglig</div>;


  // Filtrera ut alla GT_GM-sensorer
  const allSensors = batchData.flatMap((res) => res.sensor_data);
  const gtGmSensors = allSensors.filter((sensor) =>
    sensor.name.includes("GT_GM")
  );

  // Omvandla data med formatData
  const gtGmChartData =
    gtGmSensors.length > 0
      ? formatData(
          gtGmSensors[0].data.map((entry) => ({
            time_utc: entry.time_utc,
            value: entry.value,
          }))
        )
      : [];

  // Beräkna min- och maxvärden för Y-axeln
  const values = gtGmChartData.map((d) => d.value);
  const minValue = Math.floor(Math.min(...values)) - 0.5;
  const maxValue = Math.ceil(Math.max(...values)) + 0.5;

  return (
    <div className="bg-darkBg shadow-lg rounded-lg p-4 border border-neonBlue">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={gtGmChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => moment(time).format("YY:MM:DD HH:mm")} // Visa tid i format "12:30"
          />
          <YAxis domain={[minValue, maxValue]} allowDecimals={false} />
          <Tooltip
            labelFormatter={(label) => moment(label).format("YYYY-MM-DD HH:mm")}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#00BFFF" 
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#00FFFF",
              strokeWidth: 2,
              fill: "#000",
            }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

}
