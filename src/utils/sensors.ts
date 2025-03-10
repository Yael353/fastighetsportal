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


//differenceCalculator.ts;
export const calculateDifferences = (
  data: { time: number; value: number }[]
): { time: number; value: number }[] => {
  return data.map((entry, index) => {
    if (index === 0) {
      // Första värdet har ingen differens, så vi sätter den till 0
      return { ...entry, value: 0 };
    } else {
      // Beräkna differensen mellan det aktuella värdet och det föregående
      const difference = entry.value - data[index - 1].value;
      return { ...entry, value: difference };
    }
  });
};
