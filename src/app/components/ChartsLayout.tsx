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
import {
  fetchBatchSensorData,
  fetchSensorDomain,
} from "@/features/thunks/fetchSensors";
import moment from "moment";
import { BatchSensorDataFreq } from "@/features/models/sensor-data"; // Se till att importera din enum

interface ApartmentCompProps {
  id: string;
}

const ChartsLayout = ({ id }: ApartmentCompProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // Hämta sensor-domän från property-slicen
  const sensorDomain = useSelector((state: RootState) => state.property.data);
  // Hämta batch-data från sensorData-slicen
  const sensorsState = useSelector(
    (state: RootState) => state.sensorData.sensors
  );

  // Filtrera ut sensorer för OAT och IAT
  const filteredOAT = useMemo(() => {
    if (!sensorDomain?.sensors) return [];
    return sensorDomain.sensors.filter(
      (sensor) => sensor.vala_description?.name === "OAT"
    );
  }, [sensorDomain]);

  const filteredIAT = useMemo(() => {
    if (!sensorDomain?.sensors) return [];
    return sensorDomain.sensors.filter(
      (sensor) => sensor.vala_description?.name === "IAT"
    );
  }, [sensorDomain]);

  const filteredFWT = useMemo(() => {
    if (!sensorDomain?.sensors) return [];
    return sensorDomain.sensors.filter(
      (sensor) => sensor.vala_description?.name === "FWT"
    );
  }, [sensorDomain]);

  const filteredRWT = useMemo(() => {
    if (!sensorDomain?.sensors) return [];
    return sensorDomain.sensors.filter(
      (sensor) => sensor.vala_description?.name === "RWT"
    );
  }, [sensorDomain]);

  // const filteredFWT_SP = useMemo(() => {
  //   if (!sensorDomain?.sensors) return [];
  //   return sensorDomain.sensors.filter(
  //     (sensor) => sensor.vala_description?.name === "FWT_SP"
  //   );
  // }, [sensorDomain]);

  // Effekt för att ladda sensor-domän om den saknas
  useEffect(() => {
    if (!sensorDomain) {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [dispatch, sensorDomain, id]);

  // När sensorDomain har laddats, hämta batch-data för både OAT och IAT
  useEffect(() => {
    if (!sensorDomain) return;

    // Kombinera sensor-id:n från båda grupperna
    const oatIds = filteredOAT.map((sensor) => sensor.id);
    const iatIds = filteredIAT.map((sensor) => sensor.id);
    const fwtIds = filteredFWT.map((sensor) => sensor.id);
    const rwtIds = filteredRWT.map((sensor) => sensor.id);
    const sensorIds = Array.from(new Set([...oatIds, ...iatIds , ...fwtIds, ...rwtIds]));

    if (sensorIds.length === 0) {
      console.warn(
        `⚠️ Inga sensorer med "OAT" eller "IAT" hittades för domän med id "${sensorDomain.id}"!`
      );
      return;
    }

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: sensorDomain.id,
        sensorIds,
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: BatchSensorDataFreq.raw, // Använder enum-värdet
      })
    );
  }, [dispatch, sensorDomain, filteredOAT, filteredIAT, filteredFWT, filteredRWT]);

  // Funktion för att bygga chartData för en given sensorgrupp
  const buildChartData = (
    filteredSensors: typeof filteredOAT // Båda arrayerna har samma typ
  ) => {
    if (!filteredSensors || filteredSensors.length === 0) return [];

    const sensorIds = filteredSensors.map((sensor) => sensor.id);
    // Utgå från den första sensorens data för att få tidsstämpeln
    const baseSensorId = sensorIds[0];
    const baseData = sensorsState[baseSensorId]?.sensorData || [];

    return baseData.map((dataPoint, index) => {
      const point: Record<string, any> = { time: dataPoint.time_utc };
      sensorIds.forEach((sensorId) => {
        const sensorDataArr = sensorsState[sensorId]?.sensorData;
        if (sensorDataArr && sensorDataArr[index]) {
          point[sensorId] = sensorDataArr[index].value;
        }
      });
      return point;
    });
  };

  const chartDataOAT = useMemo(() => {
    return buildChartData(filteredOAT);
  }, [filteredOAT.map(s => s.id).join(','), sensorsState]);
  
  const chartDataIAT = useMemo(() => {
    return buildChartData(filteredIAT);
  }, [filteredIAT.map(s => s.id).join(','), sensorsState]);

  const chartDataFWT = useMemo(
    () => buildChartData(filteredFWT),
    [filteredFWT, sensorsState]
  );

  const chartDataRWT = useMemo(
    () => buildChartData(filteredRWT),
    [filteredRWT, sensorsState]
  );

  const mergeChartData = (dataFWT, dataRWT) => {
    const mergedData = new Map();
  
    // Lägg till FWT-data i Map baserat på tid
    dataFWT.forEach((item) => {
      mergedData.set(item.time, { time: item.time, [filteredFWT[0]?.id]: item[filteredFWT[0]?.id] });
    });
  
    // Lägg till RWT-data i Map, se till att tid finns
    dataRWT.forEach((item) => {
      if (mergedData.has(item.time)) {
        mergedData.get(item.time)[filteredRWT[0]?.id] = item[filteredRWT[0]?.id];
      } else {
        mergedData.set(item.time, { time: item.time, [filteredRWT[0]?.id]: item[filteredRWT[0]?.id] });
      }
    });
  
    // Konvertera tillbaka till array och sortera efter tid
    return Array.from(mergedData.values()).sort((a, b) => new Date(a.time) - new Date(b.time));
  };
  
  const mergedChartData = useMemo(
    () => mergeChartData(chartDataFWT, chartDataRWT),
    [chartDataFWT, chartDataRWT]
  );
  

  // Kontroll för laddning
  const propertyLoading = useSelector(
    (state: RootState) => state.property.loading
  );

  if (propertyLoading) {
    return <p>🔄 Laddar sensor data...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Diagram för utomhustemperatur (OAT) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Utomhustemperatur (OAT)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataOAT}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {filteredOAT.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={sensor.id}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                    name={sensor.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Diagram för inomhustemperatur (IAT) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Inomhustemperatur (IAT)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartDataIAT}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                {filteredIAT.map((sensor) => (
                  <Line
                    key={sensor.id}
                    type="monotone"
                    dataKey={sensor.id}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(
                      16
                    )}`}
                    name={sensor.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Exempel på ett tredje diagram om du vill jämföra alla sensorer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Jämförelse</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mergedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {[...filteredFWT, ...filteredRWT].map((sensor) => (
                <Line
                  key={sensor.id}
                  type="monotone"
                  dataKey={sensor.id}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                  name={sensor.name}
                  connectNulls={true}
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
