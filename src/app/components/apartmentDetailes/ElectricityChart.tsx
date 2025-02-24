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

interface Props {
  batchData: BatchSensorDataResponse[] | null;
}

export default function ElectricityChart({ batchData }: Props) {
  if (!batchData) return <div>Ingen elförbrukningsdata tillgänglig</div>;

  console.log("Elektrisitet från lägenhet", batchData);

  const allSensors = batchData.flatMap((res) => res.sensor_data);
  const elSensors = allSensors.filter((sensor) => sensor.name.includes("EL"));
  const elChartData = elSensors.length > 0 ? elSensors[0].data : [];

  return (
    <div className="p-4 bg-gray-700 shadow-md rounded-lg">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={elChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time_utc" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
