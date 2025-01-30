import { createSlice } from "@reduxjs/toolkit";
import { fetchBatchSensorData } from "../thunks/fetchSensors";
import { BatchSensorDataResponse } from "../models/sensor-data";

interface SensorDataState {
  sensors: Record<string, { sensorData: any; loading: boolean; error: string | null }>;
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
            state.sensors[sensorId] = { sensorData: [], loading: false, error: null };
          }
          state.sensors[sensorId].loading = true;
          state.sensors[sensorId].error = null;
        });
      })
      .addCase(fetchBatchSensorData.fulfilled, (state, action) => {
        const { meta, payload } = action;
        
        console.log("✅ Sensordata sparas i Redux:", payload); // ✅ Logga datan här
      
        meta.arg.sensorIds.forEach((sensorId) => {
          if (!state.sensors[sensorId]) {
            state.sensors[sensorId] = { sensorData: [], loading: false, error: null };
          }
          state.sensors[sensorId].sensorData = payload.sensor_data.find(
            (s) => s.id === sensorId
          )?.data || [];
          state.sensors[sensorId].loading = false;
          state.sensors[sensorId].error = null;
        });
      })
      
      .addCase(fetchBatchSensorData.rejected, (state, action) => {
        const { meta } = action;
        meta.arg.sensorIds.forEach((sensorId) => {
          if (!state.sensors[sensorId]) {
            state.sensors[sensorId] = { sensorData: [], loading: false, error: null };
          }
          state.sensors[sensorId].loading = false;
          state.sensors[sensorId].error = action.error.message || "Failed to fetch data";
        });
      });
  },
});

export default sensorDataSlice.reducer;
