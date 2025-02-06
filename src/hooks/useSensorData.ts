import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { RootState, AppDispatch } from "@/features/store/store";
import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
import moment from "moment";
import { BatchSensorDataFreq } from "@/features/models/sensor-data";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";

export const useSensorData = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Hämta sensor-domain från Redux-storen
  const sensorDomain = useSelector((state: RootState) => state.property.data);
  // Hämta batch-sensor data från Redux-storen
  const sensorsState = useSelector((state: RootState) => state.sensorData.sensors);

  // Filtrera ut sensorer för OAT, IAT, FWT och RWT
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

  // Effekt för att ladda sensor-domän om den saknas
  useEffect(() => {
    if (!sensorDomain) {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [dispatch, sensorDomain, id]);

  // Hämta batch-sensor data när sensorDomain har laddats
  useEffect(() => {
    if (!sensorDomain) return;

    const sensorIds = [
      ...filteredOAT.map((sensor) => sensor.id),
      ...filteredIAT.map((sensor) => sensor.id),
      ...filteredFWT.map((sensor) => sensor.id),
      ...filteredRWT.map((sensor) => sensor.id),
    ];

    if (sensorIds.length === 0) {
      console.warn(`⚠️ Inga sensorer med OAT, IAT, FWT eller RWT hittades!`);
      return;
    }

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: sensorDomain.id,
        sensorIds,
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: BatchSensorDataFreq.raw,
      })
    );
  }, [dispatch, sensorDomain, filteredOAT, filteredIAT, filteredFWT, filteredRWT]);

  // Funktion för att bygga chartData
  const buildChartData = (filteredSensors: typeof filteredOAT) => {
    if (!filteredSensors || filteredSensors.length === 0) return [];

    const sensorIds = filteredSensors.map((sensor) => sensor.id);
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

  // Hämta och bearbeta datan för graferna
  const chartDataOAT = useMemo(() => buildChartData(filteredOAT), [filteredOAT, sensorsState]);
  const chartDataIAT = useMemo(() => buildChartData(filteredIAT), [filteredIAT, sensorsState]);
  const chartDataFWT = useMemo(() => buildChartData(filteredFWT), [filteredFWT, sensorsState]);
  const chartDataRWT = useMemo(() => buildChartData(filteredRWT), [filteredRWT, sensorsState]);

  // Returnera de bearbetade datan för graferna
  return {
    chartDataOAT,
    chartDataIAT,
    chartDataFWT,
    chartDataRWT,
    filteredOAT,
    filteredIAT,
    filteredFWT,
    filteredRWT
  };
};
