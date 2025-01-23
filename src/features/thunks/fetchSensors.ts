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
import { SummarySensorDomainApartmentStatisticsResponse } from "../models/statistics";

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

    // console.log("sensor response:", response);

    if (response.status === 404) {
      throw new RESPONSE_404("Fel uppgifter, prova igen");
    } else if (response.status === 403) {
      throw new RESPONSE_403("Fel uppgifter, prova igen");
    }

    const responseJson = await response.json();

    // console.log("Fetched sensor domain:", responseJson);

    return responseJson as SensorDomain;
  } catch (error: any) {
    // console.error("Error fetching sensor domain:", error.message || error);

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
  BatchSensorDataResponse,
  {
    sensorDomainId: string;
    sensorIds: string[];
    startUtc: Moment;
    endUtc: Moment;
    freq: BatchSensorDataFreq;
  },
  { state: RootState; dispatch: AppDispatch; rejectValue: string } // Context-typer
>(
  "sensorDomain/fetchBatchSensorData",
  async (
    { sensorDomainId, sensorIds, startUtc, endUtc, freq },
    { dispatch, rejectWithValue }
  ) => {
    try {
      // Bygg query-parametrar
      const params = new URLSearchParams({
        sensors: sensorIds.join(","),
        freq: freq.toString(),
        start_utc: formatUtcString(startUtc),
        end_utc: formatUtcString(endUtc),
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      // Skicka API-anrop med authFetch
      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domain/${sensorDomainId}/batch/data?${params}`,
        { method: "GET" },
        dispatch
      );

      // Kontrollera svarskod
      if (response.status !== 200) {
        throw new RESPONSE_500("Någonting gick fel");
      }

      // Parsar JSON-svaret
      const responseJson = await response.json();
      // console.log("Fetched batch sensor data:", responseJson);

      return responseJson as BatchSensorDataResponse; // Returnera datan till thunken
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
    console.log(`Fetching buildings for sensor domain ID: ${id}`);
    console.log(
      `Request URL: ${apiUrl}/open/v1/sensor_domains/${id}/buildings`
    );

    const response = await authFetch(
      `${apiUrl}/open/v1/sensor_domains/${id}/buildings`,
      { method: "GET" },
      dispatch
    );

    console.log("Raw response:", response);

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
    sensordomainId: string;
    buildingId: string;
    apartmentId: string;
    days_interval: number;
  },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "apartments/fetchConsumption",
  async (
    { sensordomainId, buildingId, apartmentId, days_interval },
    { dispatch, rejectWithValue }
  ) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const params = new URLSearchParams({
      days_interval: days_interval.toString(),
    });

    try {
      console.log(
        `Fetching apartment consumption for last ${days_interval} days`
      );
      console.log(
        `Request URL: ${apiUrl}/open/v1/sensor_domains/${sensordomainId}/buildings/${buildingId}/apartments/${apartmentId}?${params}`
      );

      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains/${sensordomainId}/buildings/${buildingId}/apartments/${apartmentId}?${params}`,
        { method: "GET" },
        dispatch
      );

      console.log("Raw response:", response);

      if (response.status === 404) {
        throw new Error("Fel uppgifter, prova igen (404)");
      } else if (response.status === 403) {
        throw new Error("Fel uppgifter, prova igen (403)");
      }

      const responseJson = await response.json();

      console.log("Raw API response JSON:", responseJson);

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

export const fetchSummaryApartmentStatistics = createAsyncThunk<
  SummarySensorDomainApartmentStatisticsResponse,
  { sensorDomainId: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "apartments/fetchSummaryStatistics",
  async ({ sensorDomainId }, { rejectWithValue, dispatch }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      console.log(
        `Fetching summary statistics for sensor domain ID: ${sensorDomainId}`
      );
      console.log(
        `Request URL: ${apiUrl}/open/v1/sensor_domains/${sensorDomainId}/apartment_statistics`
      );

      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains/${sensorDomainId}/apartment_statistics`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        dispatch // Här skickar vi med dispatch från thunk
      );

      console.log("Raw response:", response);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseJson = await response.json();

      console.log("Parsed API response JSON:", responseJson);

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
