import React, { useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/features/store/store";
import { Sensor } from "@/features/models/sensor-data";

interface ApartmentCompProps {
  id: string;
}

const sensorColors: Record<string, string> = {
  FWT: "#6f42c1",
  RWT: "#007bff",
  OAT: "#28a745",
  IAT: "#dc3545",
};

interface ChartDataPoint {
  time: string;
  [key: string]: number | string;
}

const mergeChartData = (
  dataA: ChartDataPoint[],
  dataB: ChartDataPoint[],
  keyA?: string,
  keyB?: string
): ChartDataPoint[] => {
  const mergedData = new Map<string, ChartDataPoint>();

  dataA.forEach((item) => {
    mergedData.set(item.time, {
      time: item.time,
      [keyA || "keyA"]: item[keyA || "keyA"],
    });
  });

  dataB.forEach((item) => {
    if (mergedData.has(item.time)) {
      mergedData.get(item.time)![keyB || "keyB"] = item[keyB || "keyB"];
    } else {
      mergedData.set(item.time, {
        time: item.time,
        [keyB || "keyB"]: item[keyB || "keyB"],
      });
    }
  });

  return Array.from(mergedData.values()).sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
};

const ChartsLayout: React.FC<ApartmentCompProps> = ({ id }) => {
  const dispatch = useDispatch<AppDispatch>();
  const sensorDomain = useSelector((state: RootState) => state.property.data);
  const sensorsState = useSelector(
    (state: RootState) => state.sensorData.sensors
  );

  const filterSensors = (name: string): Sensor[] =>
    sensorDomain?.sensors?.filter((s) => s.vala_description?.name === name) ||
    [];

  const filteredOAT = useMemo(() => filterSensors("OAT"), [sensorDomain]);
  const filteredIAT = useMemo(() => filterSensors("IAT"), [sensorDomain]);
  const filteredFWT = useMemo(() => filterSensors("FWT"), [sensorDomain]);
  const filteredRWT = useMemo(() => filterSensors("RWT"), [sensorDomain]);

  const buildChartData = (filteredSensors: Sensor[]): ChartDataPoint[] => {
    if (!filteredSensors.length) return [];
    const sensorIds = filteredSensors.map((sensor) => sensor.id);
    const baseData = sensorsState[sensorIds[0]]?.sensorData || [];

    return baseData.map((dataPoint, index) => {
      const point: ChartDataPoint = { time: dataPoint.time_utc };
      sensorIds.forEach((sensorId) => {
        const sensorDataArr = sensorsState[sensorId]?.sensorData;
        if (sensorDataArr && sensorDataArr[index]) {
          point[sensorId] = sensorDataArr[index].value;
        }
      });
      return point;
    });
  };

  const chartDataOAT = useMemo(
    () => buildChartData(filteredOAT),
    [filteredOAT, sensorsState]
  );
  const chartDataIAT = useMemo(
    () => buildChartData(filteredIAT),
    [filteredIAT, sensorsState]
  );
  const chartDataFWT = useMemo(
    () => buildChartData(filteredFWT),
    [filteredFWT, sensorsState]
  );
  const chartDataRWT = useMemo(
    () => buildChartData(filteredRWT),
    [filteredRWT, sensorsState]
  );

  const mergedChartDataOAT_IAT = useMemo(
    () =>
      mergeChartData(
        chartDataOAT,
        chartDataIAT,
        filteredOAT[0]?.id,
        filteredIAT[0]?.id
      ),
    [chartDataOAT, chartDataIAT]
  );
  const mergedChartDataFWT_RWT = useMemo(
    () =>
      mergeChartData(
        chartDataFWT,
        chartDataRWT,
        filteredFWT[0]?.id,
        filteredRWT[0]?.id
      ),
    [chartDataFWT, chartDataRWT]
  );

  return (
    <div className="flex gap-4 w-full pt-5 py-2">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-center">
            Inomhus- och Utomhustemperatur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mergedChartDataOAT_IAT}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" stroke={sensorColors.OAT} />
              <YAxis
                yAxisId="right"
                stroke={sensorColors.IAT}
                orientation="right"
                domain={[18, 23]}
              />
              <Tooltip />
              <Legend />
              {filteredOAT.map((sensor) => (
                <Line
                  key={sensor.id}
                  type="monotone"
                  dataKey={sensor.id}
                  name="Utomhustemperatur"
                  stroke={sensorColors.OAT}
                  dot={false}
                  strokeWidth={2}
                  yAxisId="left"
                />
              ))}
              {filteredIAT.map((sensor) => (
                <Line
                  key={sensor.id}
                  type="monotone"
                  dataKey={sensor.id}
                  stroke={sensorColors.IAT}
                  name="Inomhustemperatur"
                  dot={false}
                  strokeWidth={2}
                  yAxisId="right"
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-center">Jämförelse</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mergedChartDataFWT_RWT}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[25, 45]} />
              <Tooltip />
              <Legend />
              {filteredFWT.map((sensor) => (
                <Line
                  key={sensor.id}
                  type="monotone"
                  dataKey={sensor.id}
                  name="Framledningstemperatur"
                  stroke={sensorColors.FWT}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
              {filteredRWT.map((sensor) => (
                <Line
                  key={sensor.id}
                  type="monotone"
                  dataKey={sensor.id}
                  name="Returledningstemperatur"
                  stroke={sensorColors.RWT}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsLayout;
