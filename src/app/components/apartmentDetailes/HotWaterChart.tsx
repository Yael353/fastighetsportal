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

interface Props {
  batchData: BatchSensorDataResponse[] | null;
}

export default function HotWaterChart({ batchData }: Props) {
  if (!batchData)
    return <div>Ingen varmvattenförbrukningsdata tillgänglig</div>;

  const allSensors = batchData.flatMap((res) => res.sensor_data);
  const vvSensors = allSensors.filter((sensor) => sensor.name.includes("VV"));
  const vvChartData = vvSensors.length > 0 ? vvSensors[0].data : [];

  return (
    <div className="p-4 bg-gray-700 shadow-md rounded-lg">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={vvChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time_utc" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ffc658"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
