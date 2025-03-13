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
import moment from "moment"; // Importera moment.js för att formatera tidsaxeln
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

export default function ElectricityChart({ batchData }: Props) {
  if (!batchData)
    return (
      <div className="text-white">Ingen elförbrukningsdata tillgänglig</div>
    );

  // Filtrera ut alla EL-sensorer
  const allSensors = batchData.flatMap((res) => res.sensor_data);
  const elSensors = allSensors.filter((sensor) => sensor.name.includes("EL"));

  // Omvandla data och skala ner värdena
  const elChartDataArray =
    elSensors.length > 0
      ? formatData(
          elSensors[0].data.map((entry) => ({
            time_utc: entry.time_utc,
            value: Math.round(entry.value * 100) / 100, 
          }))
        )
      : [];

 
  const elChartDataWithDifferences = calculateDifferences(elChartDataArray);

  return (
    <div className="bg-darkBg shadow-lg rounded-lg p-4 border border-neonBlue">
      <ChartContainer
        config={{
          value: {
            label: "Elförbrukning (kWh)",
            theme: {
              light: "#00BFFF",
              dark: "#00BFFF", 
            },
          },
        }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={elChartDataWithDifferences}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#00BFFF"
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => moment(time).format("HH:mm")}
              stroke="#00BFFF"
            />
            <YAxis
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
              tickFormatter={(value) => value.toFixed(0)}
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
