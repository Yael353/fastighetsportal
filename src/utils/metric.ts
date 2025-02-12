export const roundSensorMetric = (unit: string, value: number) => {
  return unit === "C"
    ? Math.round(value * 100) / 100
    : Math.round(value * 10) / 10;
};

export const formatSensorUnit = (unit: string) => {
  return unit === "C" ? "C°" : unit;
};
