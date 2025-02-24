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

export default function TemperatureChart({ batchData }: Props) {
  if (!batchData) return <div>Ingen temperaturdata tillgänglig</div>;

  const allSensors = batchData.flatMap((res) => res.sensor_data);
  const gtGmSensors = allSensors.filter((sensor) =>
    sensor.name.includes("GT_GM")
  );
  const gtGmChartData = gtGmSensors.length > 0 ? gtGmSensors[0].data : [];

 return (
   <div className="bg-gray-700 shadow-md rounded-lg flex flex-col items-center w-full h-full">
     <div className="w-full h-full flex items-center justify-center">
       <ResponsiveContainer width="100%" height="100%">
         <LineChart data={gtGmChartData}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="time_utc" />
           <YAxis />
           <Tooltip />
           <Legend />
           <Line
             type="monotone"
             dataKey="value"
             stroke="#82ca9d"
             activeDot={{ r: 8 }}
           />
         </LineChart>
       </ResponsiveContainer>
     </div>
   </div>
 );

}
