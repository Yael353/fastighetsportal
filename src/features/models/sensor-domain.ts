export type SensorValaDescription = {
  name: string;
  name_long: string;
  unit: string;
  unit_long: string;
  measurement_name: string;
  measurement_type: string;
};

export type Sensors = {
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

export type SensorWithApartmentMetadata = Sensors & {
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
  sensors: Sensors[];
  controllers: SensorDomainController[];
  harvester: SensorDomainHarvester;
};
