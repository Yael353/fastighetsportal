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
import moment from "moment"; // Importera moment.js för att formatera tidsaxeln
import { formatData } from "@/utils/date";

interface Props {
  batchData: BatchSensorDataResponse[] | null;
}

export default function ElectricityChart({ batchData }: Props) {
  if (!batchData) return <div className="text-white">Ingen elförbrukningsdata tillgänglig</div>;

  // Filtrera ut alla EL-sensorer
  const allSensors = batchData.flatMap((res) => res.sensor_data);

  console.log("allsensors",allSensors);
  
  const elSensors = allSensors.filter((sensor) => sensor.name.includes("EL"));

  // Omvandla data och skala ner värdena
 const elChartDataArray =
   elSensors.length > 0
     ? formatData(
         elSensors[0].data.map((entry) => ({
           time_utc: entry.time_utc,
           value: Math.round(entry.value * 100) / 100, // Här avrundar vi värdet till en decimal
         }))
       )
     : [];

  return (
    <div className="bg-gray-700 rounded-lg p-2">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={elChartDataArray}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => moment(time).format("HH:mm")} // Visa tid i timmar och minuter
          />
          <YAxis
            tickFormatter={(value) => value.toFixed(0)}
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
          />
          <Tooltip
            labelFormatter={(label) => moment(label).format("YYYY-MM-DD HH:mm")}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend />
          <Bar dataKey="value" fill="#659BF7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
