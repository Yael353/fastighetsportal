export type SensorValaDescription = {
  name: string;
  name_long: string;
  unit: string;
  unit_long: string;
  measurement_name: string;
  measurement_type: string;
};

export type Sensor = {
  id: string;
  name: string;
  api_id: string;
  interval: number;
  description: string;
  vala_description: SensorValaDescription;
  last_modified: Date;
};

export type ApartmentMetadata = {
  size_type: string;
  size_kvm: number;
  owner: string;
  building: string;
  object_type: string;
};

export type SensorWithApartmentMetadata = Sensor & {
  apartment_metadata: ApartmentMetadata;
};

export type SensorDomainController = {
  active: boolean;
  id: string;
};

export type SensorDomainHarvester = {
  active: boolean;
  id: string;
};

export type SensorDomain = {
  id: string;
  name: string;
  bucket_name: string;
  info: string;
  location: {
    latitude: number;
    longitude: number;
  };
  sensors: Sensor[];
  controllers: SensorDomainController[];
  harvester: SensorDomainHarvester;
};

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
  api_id: string;
  owner: string;
  building_id: string;
  apartments: ApartmentResponse[];
  size_type_distribution: Map<string, number>;
  size_kvm_distribution: object;
};

export type BuildingsResponse = Record<string, BuildingResponse>;

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
