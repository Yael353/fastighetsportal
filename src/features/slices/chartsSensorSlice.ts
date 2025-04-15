import { createSlice } from "@reduxjs/toolkit";
import { fetchChartSensorData } from "../thunks/chartFetch";
import { BatchSensorDataResponse } from "../models/sensor-data";

interface ChartsSensorDataState {
  sensors: Record<string, any>;
  loading: boolean;
}

const initialState: ChartsSensorDataState = {
  sensors: {},
  loading: false, 
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
    builder
      .addCase(fetchChartSensorData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChartSensorData.fulfilled, (state, action) => {
        state.loading = false;
  
        action.payload.forEach((batch: BatchSensorDataResponse) => {
          batch.sensor_data?.forEach((sensor) => {
            state.sensors[sensor.id] = {
              sensorData: sensor.data,
            };
          });
        });
      })
      .addCase(fetchChartSensorData.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const { resetChartsData } = chartsSensorSlice.actions;
export default chartsSensorSlice.reducer;