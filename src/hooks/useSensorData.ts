import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef } from "react";
import { RootState, AppDispatch } from "@/features/store/store";
import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
import moment from "moment";
import { BatchSensorDataFreq } from "@/features/models/sensor-data";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";

export const useSensorData = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Hämta sensor-domain från Redux-storen
  const sensorDomain = useSelector((state: RootState) => state.property.data);
  // Hämta batch-sensordata från Redux-storen
  const sensorsState = useSelector((state: RootState) => state.sensorData.sensors);

  // Hämta och filtrera alla relevanta sensorer
  const filteredSensors = useMemo(() => {
    if (!sensorDomain?.sensors) return [];
    return sensorDomain.sensors.filter((sensor) =>
      ["OAT", "IAT", "FWT", "RWT"].includes(sensor.vala_description?.name)
    );
  }, [sensorDomain]);

  useEffect(() => {
    if (!sensorDomain) {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [dispatch, sensorDomain, id]);

  const hasFetchedBatchData = useRef(false);

  useEffect(() => {
    if (!sensorDomain || hasFetchedBatchData.current) return;

    const sensorIds = filteredSensors.map((sensor) => sensor.id);
    if (sensorIds.length === 0) return;

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: sensorDomain.id,
        sensorIds,
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: BatchSensorDataFreq.raw,
      })
    );

    hasFetchedBatchData.current = true;
  }, [dispatch, sensorDomain, filteredSensors]);

  // Funktion för att hämta senaste värdet från en sensor
  const getLatestValue = (sensorId: string) => {
    const sensorData = sensorsState[sensorId]?.sensorData || [];
    return sensorData.length > 0 ? sensorData[sensorData.length - 1].value : null;
  };

  // Funktion för att hämta senaste datan för en sensor
  const getChartData = (sensorId: string) => {
    return sensorsState[sensorId]?.sensorData || [];
  };

  // Skapa en lista med all sensor-information
  const sensorList = filteredSensors.map((sensor) => ({
    title: sensor.vala_description.name_long || sensor.vala_description.name,
    value: getLatestValue(sensor.id),
    data: getChartData(sensor.id),
  }));

  return { sensorList };
};












// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useMemo, useRef } from "react";
// import { RootState, AppDispatch } from "@/features/store/store";
// import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
// import moment from "moment";
// import { BatchSensorDataFreq } from "@/features/models/sensor-data";
// import { fetchSensorDomain } from "@/features/thunks/fetchSensors";

// export const useSensorData = (id: string, selectedControllerId: string) => {
//   const dispatch = useDispatch<AppDispatch>();

//   // Hämta sensor-domain från Redux-storen
//   const sensorDomain = useSelector((state: RootState) => state.property.data);
//   // Hämta batch-sensordata från Redux-storen
//   const sensorsState = useSelector(
//     (state: RootState) => state.sensorData.sensors
//   );
//   useEffect(() => {
//     if (sensorDomain?.sensors) {
//       console.log("📌 Exempel på en sensor från sensorDomain:", sensorDomain.sensors[0]);
//     } else {
//       console.log("⚠️ Ingen sensordata hittades!");
//     }
//   }, [sensorDomain]);

//   // Filtrera ut sensorer för OAT, IAT, FWT och RWT
//   const filteredOAT = useMemo(() => {
//     if (!sensorDomain?.sensors) return [];
//     return sensorDomain.sensors.filter(
//       (sensor) => sensor.vala_description?.name === "OAT"
//     );
//   }, [sensorDomain]);

//   const filteredIAT = useMemo(() => {
//     if (!sensorDomain?.sensors) return [];
//     return sensorDomain.sensors.filter(
//       (sensor) => sensor.vala_description?.name === "IAT"
//     );
//   }, [sensorDomain]);

//   const filteredFWT = useMemo(() => {
//     if (!sensorDomain?.sensors) return [];
//     return sensorDomain.sensors.filter(
//       (sensor) => sensor.vala_description?.name === "FWT"
//     );
//   }, [sensorDomain]);

//   const filteredRWT = useMemo(() => {
//     if (!sensorDomain?.sensors) return [];
//     return sensorDomain.sensors.filter(
//       (sensor) => sensor.vala_description?.name === "RWT"
//     );
//   }, [sensorDomain]);

//   // Effekt för att ladda sensor-domän om den saknas
//   useEffect(() => {
//     if (!sensorDomain) {
//       dispatch(fetchSensorDomain({ id }));
//     }
//   }, [dispatch, sensorDomain, id]);

//   // Ref för att säkerställa att batch-fetch bara sker en gång per sensorDomain
//   const hasFetchedBatchData = useRef(false);
//   const lastFetchedSensorDomainId = useRef<string | null>(null);

//   useEffect(() => {
//     if (!sensorDomain) return;

//     // Om sensorDomain.id har ändrats, tillåt en ny hämtning
//     if (lastFetchedSensorDomainId.current !== sensorDomain.id) {
//       hasFetchedBatchData.current = false;
//     }

//     // Om vi redan har hämtat batch-data för denna sensorDomain, hoppa över
//     if (hasFetchedBatchData.current) return;

//     const sensorIds = [
//       ...filteredOAT.map((sensor) => sensor.id),
//       ...filteredIAT.map((sensor) => sensor.id),
//       ...filteredFWT.map((sensor) => sensor.id),
//       ...filteredRWT.map((sensor) => sensor.id),
//     ];

//     if (sensorIds.length === 0) {
//       console.warn(`⚠️ Inga sensorer med OAT, IAT, FWT eller RWT hittades!`);
//       return;
//     }

//     dispatch(
//       fetchBatchSensorData({
//         sensorDomainId: sensorDomain.id,
//         sensorIds,
//         startUtc: moment().subtract(1, "day"),
//         endUtc: moment(),
//         freq: BatchSensorDataFreq.raw,
//       })
//     );

//     hasFetchedBatchData.current = true;
//     lastFetchedSensorDomainId.current = sensorDomain.id;
//   }, [
//     dispatch,
//     sensorDomain,
//     filteredOAT,
//     filteredIAT,
//     filteredFWT,
//     filteredRWT,
//   ]);

//   // Funktion för att bygga chartData
//   const buildChartData = (filteredSensors: typeof filteredOAT) => {
//     if (!filteredSensors || filteredSensors.length === 0) return [];

//     const sensorIds = filteredSensors.map((sensor) => sensor.id);
//     const baseSensorId = sensorIds[0];
//     const baseData = sensorsState[baseSensorId]?.sensorData || [];

//     return baseData.map((dataPoint, index) => {
//       const point: Record<string, any> = { time: dataPoint.time_utc };
//       sensorIds.forEach((sensorId) => {
//         const sensorDataArr = sensorsState[sensorId]?.sensorData;
//         if (sensorDataArr && sensorDataArr[index]) {
//           point[sensorId] = sensorDataArr[index].value;
//         }
//       });
//       return point;
//     });
//   };

//   // Hämta och bearbeta datan för graferna
//   const chartDataOAT = useMemo(
//     () => buildChartData(filteredOAT),
//     [filteredOAT, sensorsState]
//   );
//   const chartDataIAT = useMemo(
//     () => buildChartData(filteredIAT),
//     [filteredIAT, sensorsState]
//   );
//   const chartDataFWT = useMemo(
//     () => buildChartData(filteredFWT),
//     [filteredFWT, sensorsState]
//   );
//   const chartDataRWT = useMemo(
//     () => buildChartData(filteredRWT),
//     [filteredRWT, sensorsState]
//   );

//   // Hämta senaste värdet från en sensor
//   const getLatestValue = (
//     chartData: typeof chartDataIAT,
//     filteredSensors: typeof filteredIAT
//   ) => {
//     if (!chartData || chartData.length === 0) return null;
//     return chartData[chartData.length - 1]?.[filteredSensors[0]?.id] || null;
//   };

//   // Hämta senaste värdena för varje sensor
//   const latestIAT = getLatestValue(chartDataIAT, filteredIAT);
//   const latestOAT = getLatestValue(chartDataOAT, filteredOAT);
//   const latestFWT = getLatestValue(chartDataFWT, filteredFWT);
//   const latestRWT = getLatestValue(chartDataRWT, filteredRWT);

//   // Hämta och formatera tiden för senaste värdet från en sensor
//   const getLatestTimestamp = (chartData: typeof chartDataIAT) => {
//     if (!chartData || chartData.length === 0) return null;
//     const latestTime = chartData[chartData.length - 1]?.time;
//     return latestTime ? moment(latestTime).format("YYYY-MM-DD HH:mm") : null;
//   };

//   // Hämta formaterade tider för varje sensor
//   const latestIATTime = getLatestTimestamp(chartDataIAT);
//   const latestOATTime = getLatestTimestamp(chartDataOAT);
//   const latestFWTTime = getLatestTimestamp(chartDataFWT);
//   const latestRWTTime = getLatestTimestamp(chartDataRWT);

//   // Funktion för att formatera data för BarChart
//   const getBarChartData = (chartData: any[], filteredSensors: any[]) => {
//     if (!chartData || chartData.length === 0 || filteredSensors.length === 0)
//       return [];

//     const sensorId = filteredSensors[0]?.id;

//     return chartData.slice(-5).map((dataPoint) => ({
//       value: dataPoint[sensorId],
//     }));
//   };

//   useEffect(() => {
//     console.log("📌 Alla controllers från Redux:", sensorDomain?.controllers);
//     console.log("📌 Alla sensorer från Redux:", sensorDomain?.sensors);
//   }, [sensorDomain]);
  

//   // Formaterad data för BarChart för varje sensor
//   const barChartDataIAT = getBarChartData(chartDataIAT, filteredIAT);
//   const barChartDataOAT = getBarChartData(chartDataOAT, filteredOAT);
//   const barChartDataFWT = getBarChartData(chartDataFWT, filteredFWT);
//   const barChartDataRWT = getBarChartData(chartDataRWT, filteredRWT);

//   return {
//     chartDataOAT,
//     chartDataIAT,
//     chartDataFWT,
//     chartDataRWT,
//     filteredOAT,
//     filteredIAT,
//     filteredFWT,
//     filteredRWT,
//     latestIAT,
//     latestOAT,
//     latestFWT,
//     latestRWT,
//     latestIATTime,
//     latestOATTime,
//     latestFWTTime,
//     latestRWTTime,
//     barChartDataIAT,
//     barChartDataOAT,
//     barChartDataFWT,
//     barChartDataRWT,
//   };
// };