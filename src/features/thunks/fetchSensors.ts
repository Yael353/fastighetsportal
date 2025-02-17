import { authFetch } from "@/utils/fetch";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AllApartmentConsumptionResponse,
  BatchSensorDataFreq,
  BatchSensorDataResponse,
  BuildingsResponse,
  SensorDomain,
} from "../models/sensor-data";
import { RESPONSE_403, RESPONSE_404, RESPONSE_500 } from "../errors/errors";
import { AppDispatch, RootState } from "../store/store";
import { Moment } from "moment";
import { formatUtcString } from "@/utils/date";
import {
  MonthlyApartmentStatisticsResponse,
  SummarySensorDomainApartmentStatisticsResponse,
} from "../models/statistics";
import { paginateArray } from "@/utils/paginator";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Enskilda properties:
export const fetchSensorDomain = createAsyncThunk<
  SensorDomain,
  { id: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("sensorDomain/fetch", async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    // console.log(`Fetching sensor domain with ID: ${id}`);
    // console.log(`Request URL: ${apiUrl}/open/v1/sensor_domains/${id}`);

    const response = await authFetch(
      `${apiUrl}/open/v1/sensor_domains/${id}`,
      { method: "GET" },
      dispatch
    );

    if (response.status === 404) {
      throw new RESPONSE_404("Fel uppgifter, prova igen");
    } else if (response.status === 403) {
      throw new RESPONSE_403("Fel uppgifter, prova igen");
    }

    const responseJson = await response.json();

    // console.log("Sensordomain från fetchSensors ", responseJson);
    return responseJson as SensorDomain;
  } catch (error: any) {
    console.error("Error fetching sensor domain:", error.message || error);

    if (error instanceof RESPONSE_404 || error instanceof RESPONSE_403) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(
      error.message ||
        "Ett oväntat fel inträffade vid hämtning av sensor-domänen"
    );
  }
});

// hämta batch-sensordata
export const fetchBatchSensorData = createAsyncThunk<
  BatchSensorDataResponse[],
  {
    sensorDomainId: string;
    sensorIds: string[];
    startUtc: Moment;
    endUtc: Moment;
    freq: BatchSensorDataFreq;
  },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "sensorDomain/fetchBatchSensorData",
  async (
    { sensorDomainId, sensorIds, startUtc, endUtc, freq },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL saknas i miljövariabler!");
      }

      // Använd paginering för att dela upp sensorIds i batcher
      const MAX_SENSOR_IDS_PER_BATCH = 10;
      const sensorBatches = paginateArray(sensorIds, MAX_SENSOR_IDS_PER_BATCH);
      const allResponses: BatchSensorDataResponse[] = [];

      // Loopa igenom varje batch och gör ett API-anrop
      for (const batch of sensorBatches) {
        const params = new URLSearchParams({
          sensors: batch.join(","),
          freq: freq.toString(),
          start_utc: formatUtcString(startUtc),
          end_utc: formatUtcString(endUtc),
        });

        const fullUrl = `${apiUrl}/open/v1/sensor_domain/${sensorDomainId}/batch/data?${params}`;

        // Skicka API-anrop med authFetch
        const response = await authFetch(fullUrl, { method: "GET" }, dispatch);

        // Parsar och lagrar varje batchs svar
        const responseJson = await response.json();

        allResponses.push(responseJson);
      }

      // Kombinera alla batch-svar till en array
      return allResponses;
    } catch (error: any) {
      console.error(
        "Error fetching batch sensor data:",
        error.message || error
      );

      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid hämtning av batch-sensordata"
      );
    }
  }
);

// Hämta byggnader
export const fetchBuildings = createAsyncThunk<
  BuildingsResponse,
  { id: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("buildings/fetch", async ({ id }, { dispatch, rejectWithValue }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await authFetch(
      `${apiUrl}/open/v1/sensor_domains/${id}/buildings`,
      { method: "GET" },
      dispatch
    );

    if (response.status === 404) {
      throw new Error("Fel uppgifter, prova igen (404)");
    } else if (response.status === 403) {
      throw new Error("Fel uppgifter, prova igen (403)");
    }

    const responseJson = await response.json();

    console.log("Raw API response JSON:", responseJson);

    const responseObject = Object.fromEntries(Object.entries(responseJson));

    return responseObject as BuildingsResponse;
  } catch (error: any) {
    console.error("Error fetching buildings:", error.message || error);

    if (error.message.includes("404") || error.message.includes("403")) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue(
      error.message || "Ett oväntat fel inträffade vid hämtning av byggnader"
    );
  }
});

//hämta fastighetsförbrukning
export const fetchApartmentConsumptionLastXDays = createAsyncThunk<
  AllApartmentConsumptionResponse,
  {
    sensorDomainId: string;
    buildingId: string;
    apartmentId: string;
    days_interval: number;
  },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "apartments/fetchConsumption",
  async (
    { sensorDomainId, buildingId, apartmentId, days_interval },
    { dispatch, rejectWithValue }
  ) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const params = new URLSearchParams({
      days_interval: days_interval.toString(),
    });

    try {
      const fetchedURL = `${apiUrl}/open/v1/sensor_domains/${sensorDomainId}/buildings/${buildingId}/apartments/${apartmentId}?${params}`;
      // console.log("Data som hämtas", fetchedURL);

      const response = await authFetch(fetchedURL, { method: "GET" }, dispatch);

      if (response.status === 404) {
        throw new Error("Fel uppgifter, prova igen (404)");
      } else if (response.status === 403) {
        throw new Error("Fel uppgifter, prova igen (403)");
      }

      const responseJson = await response.json();

      // console.log("JsonRespons", responseJson);

      return responseJson as AllApartmentConsumptionResponse;
    } catch (error: any) {
      console.error(
        "Error fetching apartment consumption:",
        error.message || error
      );

      if (error.message.includes("404") || error.message.includes("403")) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid hämtning av förbrukningsdata"
      );
    }
  }
);

//KLAR OCH ANVÄND?????
export const fetchSummaryApartmentStatistics = createAsyncThunk<
  SummarySensorDomainApartmentStatisticsResponse,
  { sensorDomainId: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "apartments/fetchSummaryStatistics",
  async ({ sensorDomainId }, { rejectWithValue, dispatch }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains/${sensorDomainId}/apartment_statistics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        dispatch
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseJson = await response.json();

      return responseJson as SummarySensorDomainApartmentStatisticsResponse;
    } catch (error: any) {
      console.error(
        "Error fetching summary statistics:",
        error.message || error
      );

      if (error.message.includes("401") || error.message.includes("403")) {
        return rejectWithValue(
          "Du har blivit utloggad. Vänligen logga in igen."
        );
      }

      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid hämtning av sammanfattningsstatistik."
      );
    }
  }
);

//REDAN KLAR OCH ANVÄND
export const fetchMonthlyApartmentStatistics = createAsyncThunk<
  MonthlyApartmentStatisticsResponse,
  {
    sensorDomainId: string;
    buildingId: string;
    apartmentId: string;
  },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "apartments/fetchMonthlyStatistics",
  async (
    { sensorDomainId, buildingId, apartmentId },
    { dispatch, rejectWithValue }
  ) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      console.log("Fetching monthly apartment statistics");

      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains/${sensorDomainId}/buildings/${buildingId}/apartments/${apartmentId}/consumption/monthly`,
        {},
        dispatch
      );

      if (response.status === 404) {
        throw new Error("Fel uppgifter, prova igen (404)");
      } else if (response.status === 403) {
        throw new Error("Fel uppgifter, prova igen (403)");
      }

      const responseJson = await response.json();
      return responseJson as MonthlyApartmentStatisticsResponse;
    } catch (error: any) {
      console.error(
        "Error fetching monthly statistics:",
        error.message || error
      );

      if (error.message.includes("404") || error.message.includes("403")) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid hämtning av månatlig förbrukningsdata"
      );
    }
  }
);
