import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState, useRef } from "react";
import { RootState, AppDispatch } from "@/features/store/store";
import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
import moment from "moment";
import { BatchSensorDataFreq } from "@/features/models/sensor-data";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import { Loader2 } from "lucide-react";

export const useSensorData = (id: string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Hämta sensor-domain från Redux-storen
  const sensorDomain = useSelector((state: RootState) => state.property.data);
  const sensorsState = useSelector(
    (state: RootState) => state.sensorData.sensors
  );

  // Hämta husets namn
  const propertyName = sensorDomain?.name || "Invänta hus";

  // Hitta alla unika undercentraler (DUCs) med minst 1 relevant sensor
  const controllers = useMemo(() => {
    if (!sensorDomain?.sensors) return [];

    const controllersSet = new Set<string>();

    sensorDomain.sensors.forEach((sensor) => {
      const match = sensor.name.match(/DUC\d+/);

      const isTemperatureSensor =
        sensor.vala_description.measurement_type === "temp";
      const isNotSetPoint = !sensor.vala_description.name_long
        ?.toLowerCase()
        .includes("set point");

      if (match && isTemperatureSensor && isNotSetPoint) {
        controllersSet.add(match[0]);
      }
    });

    return Array.from(controllersSet);
  }, [sensorDomain]);

  // State för vald undercentral
  const [selectedControllerId, setSelectedControllerId] = useState<
    string | null
  >(null);

  // När vi får controllers, välj den första som default
  useEffect(() => {
    if (controllers.length > 0 && !selectedControllerId) {
      setSelectedControllerId(controllers[0]);
    }
  }, [controllers, selectedControllerId]);

  // Filtrera sensorer för vald undercentral
  const filteredSensors = useMemo(() => {
    if (!sensorDomain?.sensors || !selectedControllerId) return [];

    return sensorDomain.sensors.filter((sensor) => {
      const isFromSelectedController =
        sensor.name.includes(selectedControllerId);
      const isTemperatureSensor =
        sensor.vala_description.measurement_type === "temp";
      const isNotSetPoint = !sensor.vala_description.name_long
        ?.toLowerCase()
        .includes("set point");

      return isFromSelectedController && isTemperatureSensor && isNotSetPoint;
    });
  }, [sensorDomain, selectedControllerId]);

  const sensorIds = useMemo(() => {
    return filteredSensors.map((sensor) => sensor.id);
  }, [filteredSensors]);
  

  // Hämta sensorDomain om det saknas
  useEffect(() => {
    if (!sensorDomain) {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [dispatch, sensorDomain, id]);

  useEffect(() => {
    if (!sensorDomain || !selectedControllerId || sensorIds.length === 0) return;

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: sensorDomain.id,
        sensorIds,
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: BatchSensorDataFreq.raw,
      })
    );
  }, [
    dispatch,
    sensorDomain?.id,
    selectedControllerId,
    sensorIds.join(","), 
  ]);
  

  // Funktion för att hämta senaste värdet från en sensor
  const getLatestValue = (sensorId: string) => {
    const sensorData = sensorsState[sensorId]?.sensorData || [];
    return sensorData.length > 0
      ? sensorData[sensorData.length - 1].value
      : null;
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

  return {
    sensorList,
    controllers,
    selectedControllerId,
    setSelectedControllerId,
    propertyName,
  };
};
