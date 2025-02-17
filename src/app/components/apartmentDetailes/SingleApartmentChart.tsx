import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from "@/components/ui/chart";
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
import { ApartmentConsumptionResponse } from "@/features/models/sensor-data";

interface ChartProps {
  data: ApartmentConsumptionResponse[] | null;
  loading: boolean;
  error: string | null;
}

interface ChartData {
  name: string;
  value: number;
  description: string;
  unit: string;
}

export default function SingleApartmentChart({
  data,
  loading,
  error,
}: ChartProps) {
  if (loading) return <div>Laddar grafer...</div>;
  if (error) return <div>Fel vid hämtning av data: {error}</div>;
  if (!data) return <div>Ingen data tillgänglig</div>;

  const filterData = (
    data: ApartmentConsumptionResponse[],
    filterName: string
  ): ChartData[] => {
    return data
      .filter((item) => item.vala_description.name === filterName)
      .map((item) => ({
        name: item.vala_description.name_long,
        value: item.latest_value,
        description: item.description,
        unit: item.vala_description.unit,
      }));
  };

  // Filtrera datan baserat på name-värdena
  const ihtwmData = filterData(data, "IHTWM");
  const iemData = filterData(data, "IEM");
  const iiatData = filterData(data, "IIAT");

  // console.log("ihtwmData", ihtwmData);
  // console.log("iemData", iemData);
  // console.log("iiatData", iiatData);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Förbrukning över tid</h2>

      {/* Diagram för IHTWM */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">IHTWM</h3>
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ihtwmData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Diagram för IEM */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">IEM</h3>
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={iemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Diagram för IIAT */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">IIAT</h3>
        <ChartContainer config={{}}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={iiatData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ffc658"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
