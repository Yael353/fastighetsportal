import { SensorDomain } from "@/features/models/sensor-domain";

type SensorDomainSensorsDescMetadata = {
  ucSensors: number;
  apartments: number;
};

export const getSensorDomainSensorDescription = (
  sensorDomain: SensorDomain
): SensorDomainSensorsDescMetadata => {
  const numberUcSensors = sensorDomain.sensors.filter((s) =>
    ["FWT", "RWT", "IAT", "ORC", "P", "OAT", "BTE"].includes(
      s.vala_description.name
    )
  ).length;
  const numberApartments = sensorDomain.sensors.filter(
    (s) => s.vala_description.name === "IEM"
  ).length;
  return { ucSensors: numberUcSensors, apartments: numberApartments };
};



// 584a7bcd-7efa-4d61-b538-127a08fd5f0f