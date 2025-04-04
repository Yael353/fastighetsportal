import { createSlice } from "@reduxjs/toolkit";
import { fetchBatchSensorData } from "../thunks/fetchSensors";
import { BatchSensorDataResponse } from "../models/sensor-data";

interface SensorDataState {
  sensors: Record<
    string,
    { sensorData: any[]; loading: boolean; error: string | null }
  >;
}

const initialState: SensorDataState = {
  sensors: {},
};

const sensorDataSlice = createSlice({
  name: "sensorData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchSensorData.pending, (state, action) => {
        action.meta.arg.sensorIds.forEach((sensorId) => {
          if (!state.sensors[sensorId]) {
            state.sensors[sensorId] = {
              sensorData: [],
              loading: false,
              error: null,
            };
          }
          state.sensors[sensorId].loading = true;
          state.sensors[sensorId].error = null;
        });
      })

      .addCase(fetchBatchSensorData.fulfilled, (state, action) => {
        const { payload } = action;

        if (!Array.isArray(payload)) return; // Skyddar mot undefined/null payload

        payload.forEach((batch: BatchSensorDataResponse) => {
          if (!batch.sensor_data || !Array.isArray(batch.sensor_data)) return; // Skyddar mot undefined/null sensor_data

          batch.sensor_data.forEach((sensor) => {
            if (!sensor || !sensor.id || !Array.isArray(sensor.data)) return; // Skyddar mot undefined/null sensor eller sensor.data

            if (!state.sensors[sensor.id]) {
              state.sensors[sensor.id] = {
                sensorData: [],
                loading: false,
                error: null,
              };
            }

            const existingData = state.sensors[sensor.id].sensorData;
            const newData = sensor.data;

            const mergedData = [...existingData];

            newData.forEach((newPoint) => {
              if (!newPoint || newPoint.time_utc == null) return; // Skyddar mot undefined/null newPoint

              const exists = existingData.some(
                (oldPoint) => oldPoint.time_utc === newPoint.time_utc
              );
              if (!exists) {
                mergedData.push(newPoint);
              }
            });

            state.sensors[sensor.id].sensorData = mergedData;
            state.sensors[sensor.id].loading = false;
            state.sensors[sensor.id].error = null;
          });
        });
      })
      .addCase(fetchBatchSensorData.rejected, (state, action) => {
        const { meta } = action;
        meta.arg.sensorIds.forEach((sensorId) => {
          if (!state.sensors[sensorId]) {
            state.sensors[sensorId] = {
              sensorData: [],
              loading: false,
              error: null,
            };
          }
          state.sensors[sensorId].loading = false;
          state.sensors[sensorId].error =
            action.error.message || "Failed to fetch data";
        });
      });
  },
});

export default sensorDataSlice.reducer;
