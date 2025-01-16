import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
import { BatchSensorDataFreq, Sensor } from "@/features/models/sensor-data";
import moment from "moment";

interface SensorDataCompProps {
  propertyId: string; // Hämta id från props
}

const SensorDataComp: React.FC<SensorDataCompProps> = ({ propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();

 
  const { data: sensorDomain } = useSelector(
    (state: RootState) => state.property
  );
  const { sensorData, loading, error } = useSelector(
    (state: RootState) => state.sensorData
  );

  useEffect(() => {
    if (propertyId && sensorDomain?.sensors?.length) {
      // Säkerställer att sensors finns och har längd
      const sensorIds = sensorDomain.sensors.map((sensor: Sensor) => sensor.id); // Typat sensor
      const startUtc = moment().subtract(1, "week"); // Exempel: en vecka tillbaka
      const endUtc = moment();
      const freq = BatchSensorDataFreq.hour; // Använd korrekt typ för frekvens

      dispatch(
        fetchBatchSensorData({
          sensorDomainId: propertyId,
          sensorIds,
          startUtc,
          endUtc,
          freq,
        })
      )
        .unwrap()
        .then((data) => {
          console.log("Batch sensor data fetched successfully:", data);
        })
        .catch((error) => {
          console.error("Error fetching batch sensor data:", error);
        });
    }
  }, [propertyId, sensorDomain, dispatch]);

  if (loading) return <p>Loading sensor data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!sensorData || sensorData.length === 0)
    return <p>No sensor data found.</p>;

  return (
    <div>
      {/* Här kan du rendera ditt diagram eller annan sensordata */}
      <p>Sensor Data for Property {propertyId}:</p>
      <pre>{JSON.stringify(sensorData, null, 2)}</pre>
    </div>
  );
};

export default SensorDataComp;
