import {
  SensorValaDescription,
  SensorWithApartmentMetadata,
} from "./sensor-domain";

export type BatchSensorDataResponse = {
  sensor_data: {
    id: string;
    name: string;
    data: {
      time_utc: string;
      value: number;
    }[];
  }[];
};

export enum BatchSensorDataFreq {
  raw = "raw",
  five_min = "5min",
  hour = "H",
  day = "D",
  month = "M",
}

export type ApartmentResponse = {
  apt_id: string;
  size_type: string;
  size_kvm: number;
  building: string;
  owner: string;
  sensors: SensorWithApartmentMetadata[];
};

export type BuildingResponse = {
  name: string;
  owner: string;
  building_id: string;
  apartments: ApartmentResponse[];
  size_type_distribution: Map<string, number>;
  size_kvm_distribution: object;
};

export type BuildingsResponse = Map<string, object>;

export type ApartmentConsumptionResponse = {
  id: string;
  description: string;
  api_id: string;
  difference: number;
  vala_description: SensorValaDescription;
  first_value: number;
  latest_value: number;
  average: number;
};

export type AllApartmentConsumptionResponse = {
  data: ApartmentConsumptionResponse[];
};
