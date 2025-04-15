import { createSlice } from "@reduxjs/toolkit";
import { fetchChartSensorData } from "../thunks/chartFetch";
import { BatchSensorDataResponse } from "../models/sensor-data";

interface ChartsSensorDataState {
  sensors: Record<string, any>;
}

const initialState: ChartsSensorDataState = {
  sensors: {},
};

const chartsSensorSlice = createSlice({
  name: "chartsSensorData",
  initialState,
  reducers: {
    resetChartsData(state) {
      state.sensors = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChartSensorData.fulfilled, (state, action) => {
      action.payload.forEach((batch: BatchSensorDataResponse) => {
        batch.sensor_data?.forEach((sensor) => {
          state.sensors[sensor.id] = { sensorData: sensor.data };
        });
      });
    });
  },
});

export const { resetChartsData } = chartsSensorSlice.actions;
export default chartsSensorSlice.reducer;