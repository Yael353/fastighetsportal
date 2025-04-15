import { createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "@/utils/fetch";
import { BatchSensorDataResponse, BatchSensorDataFreq } from "../models/sensor-data";
import { paginateArray } from "@/utils/paginator";
import { formatUtcString } from "@/utils/date";
import { Moment } from "moment";
import { AppDispatch, RootState } from "../store/store";

export const fetchChartSensorData = createAsyncThunk<
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
  "chartsSensor/fetchChartSensorData",
  async (
    { sensorDomainId, sensorIds, startUtc, endUtc, freq },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API URL saknas i miljövariabler!");

      const MAX_SENSOR_IDS_PER_BATCH = 10;
      const sensorBatches = paginateArray(sensorIds, MAX_SENSOR_IDS_PER_BATCH);
      const allResponses: BatchSensorDataResponse[] = [];
// console.log("[🔄 FETCH START]", {
//   sensorDomainId,
//   totalSensorIds: sensorIds.length,
//   freq,
//   batches: sensorBatches.length,
//   range: {
//     from: formatUtcString(startUtc),
//     to: formatUtcString(endUtc),
//   },
// });
      for (const batch of sensorBatches) {
        const params = new URLSearchParams({
          sensors: batch.join(","),
          freq: freq.toString(),
          start_utc: formatUtcString(startUtc),
          end_utc: formatUtcString(endUtc),
        });

        const fullUrl = `${apiUrl}/open/v1/sensor_domain/${sensorDomainId}/batch/data?${params}`;
        // console.log(`[📡 FETCHING BATCH]`, {
        //   batchSize: batch.length,
        //   sensorIds: batch,
        //   url: fullUrl,
        // });
        const response = await authFetch(fullUrl, { method: "GET" }, dispatch);
        const responseJson = await response.json();
        allResponses.push(responseJson);
      }

      return allResponses;
    } catch (error: any) {
      console.error("Error fetching chart sensor data:", error.message || error);
      return rejectWithValue(error.message || "Fel vid hämtning av chart-data");
    }
  }
);
