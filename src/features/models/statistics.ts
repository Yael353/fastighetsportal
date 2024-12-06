export type SummaryApartmentTypeStatistics = {
  size_type: string;
  v_name: string;
  u_name: string;
  timestamp: string;
  avg: number;
  stddev: number;
};

export type SummarySensorDomainApartmentStatisticsResponse = Record<
  string,
  SummaryApartmentTypeStatistics[]
>;

export type MonthlyApartmentStatistics = {
  org_id: string;
  sensor_domain_id: string;
  sensor_id: string;
  name: string;
  apartment_id: string;
  v_name: string;
  u_name: string;
  year: number;
  month: number;
  created_at: string;
  latest_value: number;
  first_value: number;
  diff: number;
  average: number;
  year_month: string;
};

export type MonthlyApartmentStatisticsResponse = Record<
  string,
  MonthlyApartmentStatistics[]
>;
