import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { BatchSensorDataResponse } from "@/features/models/sensor-data";
import moment from "moment"; // Importera moment.js för att formatera tid i X-axeln och Tooltip
import { formatData } from "@/utils/date";
import { calculateDifferences } from "@/utils/sensors";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from "@/components/ui/chart"; // Importera komponenter från chart.tsx

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

  // Beräkna differenserna med den importerade funktionen
  const vvChartDataWithDifferences = calculateDifferences(vvChartData);

  return (
    <div className="bg-darkBg shadow-lg rounded-lg p-4 border border-neonBlue">
      <ChartContainer
        config={{
          value: {
            label: "Varmvattenförbrukning (m³)",
            theme: {
              light: "#00BFFF", 
              dark: "#00BFFF",
            },
          },
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={vvChartDataWithDifferences}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#00BFFF"
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => moment(time).format("YY-MM-DD HH:mm")}
              stroke="#00BFFF"
            />
            <YAxis
              tickFormatter={(value) => value.toFixed(2)}
              stroke="#00BFFF"
            />
            {/* Använd ChartTooltip istället för Tooltip */}
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) =>
                    moment(label).format("YYYY-MM-DD HH:mm")
                  }
                  valueFormatter={(value: number) => value.toFixed(2)}
                  contentStyle={{
                    backgroundColor: "#001220",
                    borderColor: "#00BFFF",
                    color: "#fff",
                  }}
                />
              }
            />
            {/* Använd ChartLegend istället för Legend */}
            <ChartLegend
              content={
                <ChartLegendContent wrapperStyle={{ color: "#00BFFF" }} />
              }
            />
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
      </ChartContainer>
    </div>
  );
}
