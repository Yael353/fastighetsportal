import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BatchSensorDataResponse } from "../models/sensor-data";

interface SensorDataState {
  sensorData: BatchSensorDataResponse["sensor_data"];
  loading: boolean;
  error: string | null;
}

const initialState: SensorDataState = {
  sensorData: [],
  loading: false,
  error: null,
};

const sensorDataSlice = createSlice({
  name: "sensorData",
  initialState,
  reducers: {
    fetchSensorDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSensorDataSuccess: (
      state,
      action: PayloadAction<BatchSensorDataResponse["sensor_data"]>
    ) => {
      state.loading = false;
      state.sensorData = action.payload;
    },
    fetchSensorDataFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchSensorDataStart,
  fetchSensorDataSuccess,
  fetchSensorDataFailure,
} = sensorDataSlice.actions;

export default sensorDataSlice.reducer;
