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
import moment from "moment";
import { formatData } from "@/utils/date";
import { ChartContainer } from "@/components/ui/chart";

interface Props {
  batchData: BatchSensorDataResponse[] | null;
}

export default function TemperatureChart({ batchData }: Props) {
  if (!batchData) return <div className="text-white"></div>;

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
  const minValue = Math.floor(Math.min(...values)) - 0.05;
  const maxValue = Math.ceil(Math.max(...values)) + 0.05;

  return (
    <div className="bg-gradient-to-br from-[#0A192F] to-[#112240] shadow-lg rounded-lg p-4 border border-blue-500">
      <ChartContainer
        config={{
          value: {
            label: "Inomhustemperatur (C)",
            theme: {
              light: "#00BFFF",
              dark: "#00BFFF",
            },
          },
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={gtGmChartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00BFFF" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#00BFFF" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#00BFFF"
              opacity={0.2}
            />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => moment(time).format("YY-MM-DD \n HH:mm")}
              stroke="#00BFFF"
            />
            <YAxis
              domain={[minValue, maxValue]}
              tickFormatter={(value) => value.toFixed(0)}
              stroke="#00BFFF"
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={(label) =>
                moment(label).format("YYYY-MM-DD HH:mm")
              }
              formatter={(value: number) => value.toFixed(2)}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="url(#colorValue)"
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
      </ChartContainer>
    </div>
  );
}
