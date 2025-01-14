import { authFetch } from "@/utils/fetch";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  BatchSensorDataFreq,
  BatchSensorDataResponse,
  SensorDomain,
} from "../models/sensor-data";
import { RESPONSE_403, RESPONSE_404, RESPONSE_500 } from "../errors/errors";
import { AppDispatch, RootState } from "../store/store";
import { Moment } from "moment";
import { formatUtcString } from "@/utils/date";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Enskilda properties:
export const fetchSensorDomain = createAsyncThunk<
  SensorDomain,
  { id: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("sensorDomain/fetch", async ({ id }, { dispatch, rejectWithValue }) => {
  try {
    
    console.log(`Fetching sensor domain with ID: ${id}`);
    console.log(`Request URL: ${apiUrl}/open/v1/sensor_domains/${id}`);

    const response = await authFetch(
      `${apiUrl}/open/v1/sensor_domains/${id}`,
      { method: "GET" },
      dispatch
    );

    
    console.log("Raw response:", response);

    if (response.status === 404) {
      throw new RESPONSE_404("Fel uppgifter, prova igen");
    } else if (response.status === 403) {
      throw new RESPONSE_403("Fel uppgifter, prova igen");
    }

    const responseJson = await response.json();

    
    console.log("Fetched sensor domain:", responseJson);

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

// Thunk för att hämta batch-sensordata
export const fetchBatchSensorData = createAsyncThunk<
  BatchSensorDataResponse, // Returntyp
  {
    sensorDomainId: string;
    sensorIds: string[];
    startUtc: Moment;
    endUtc: Moment;
    freq: BatchSensorDataFreq;
  }, // Payload
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
      console.log("Fetched batch sensor data:", responseJson);

      return responseJson as BatchSensorDataResponse; // Returnera datan till thunken
    } catch (error: any) {
      console.error(
        "Error fetching batch sensor data:",
        error.message || error
      );

      // Returnera felmeddelande via rejectWithValue
      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid hämtning av batch-sensordata"
      );
    }
  }
);
