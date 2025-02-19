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
import {
  ApartmentConsumptionResponse,
  BatchSensorDataResponse,
} from "@/features/models/sensor-data";

interface ChartProps {
  data: ApartmentConsumptionResponse[] | null;
  loading: boolean;
  error: string | null;

  // Ny prop för batch-datan
  batchData: BatchSensorDataResponse[] | null;
}

export default function SingleApartmentChart({
  data,
  loading,
  error,
  batchData,
}: ChartProps) {
  if (loading) return <div>Laddar grafer...</div>;
  if (error) return <div>Fel vid hämtning av data: {error}</div>;
  if (!data) return <div>Ingen aggregerad data tillgänglig</div>;

  // Finns data?
  if (!batchData) {
    return <div>Ingen tidsseriedata hämtad ännu</div>;
  }

  // 2) Här kan du platta ut arrayen (du får en array med 1 eller flera batch-responser):
  //    t.ex. om du vill samla alla sensor_data i en gemensam array
  const allSensors = batchData.flatMap((res) => res.sensor_data);

  console.log("Allsensors", allSensors);

  // 3) Filtrera baserat på om `name` innehåller "EL", "GT_GM" eller "VV"
  const elSensors = allSensors.filter((sensor) => sensor.name.includes("EL"));
  const gtGmSensors = allSensors.filter((sensor) =>
    sensor.name.includes("GT_GM")
  );
  const vvSensors = allSensors.filter((sensor) => sensor.name.includes("VV"));

  // Exempel: Om du vill skapa Recharts-data för "EL"-sensorerna
  // En sensor har `data: { time_utc, value }[]`.
  // Du kanske vill formatera det för Recharts:
  const elChartData = elSensors.length > 0 ? elSensors[0].data : []; // tar första sensorn som matchar
  console.log("elchartData", elChartData);

  // Samma sak för GT_GM:
  const gtGmChartData = gtGmSensors.length > 0 ? gtGmSensors[0].data : [];

  // Och VV:
  const vvChartData = vvSensors.length > 0 ? vvSensors[0].data : [];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Förbrukning över tid</h2>

      {/* Diagram för "GT_GM" */}
      {gtGmSensors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">GT_GM (exempel)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gtGmChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time_utc" />
              <YAxis domain={["dataMin -0.5", "dataMax + 0.5"]} />
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
      )}

      {/* Diagram för "EL"-sensorer */}
      {elSensors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">
            El-förbrukning (exempel)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={elChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time_utc" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Diagram för "VV" */}
      {vvSensors.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Varmvatten (VV)</h3>
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
      )}
    </div>
  );
}
