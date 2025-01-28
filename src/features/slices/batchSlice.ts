import { createSlice } from "@reduxjs/toolkit";
import { fetchBatchSensorData } from "../thunks/fetchSensors";
import { BatchSensorDataResponse } from "../models/sensor-data"

interface SensorDataState {
  outdoor: { sensorData: any; loading: boolean; error: string | null };
  indoor: { sensorData: any; loading: boolean; error: string | null };
  supply: { sensorData: any; loading: boolean; error: string | null };
  return: { sensorData: any; loading: boolean; error: string | null };
}

const initialState: SensorDataState = {
  outdoor: { sensorData: [], loading: false, error: null },
  indoor: { sensorData: [], loading: false, error: null },
  supply: { sensorData: [], loading: false, error: null },
  return: { sensorData: [], loading: false, error: null },
};

const sensorDataSlice = createSlice({
  name: "sensorData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchSensorData.pending, (state, action) => {
        const { meta } = action;
        if (meta.arg.sensorIds.includes("3516f208-56cc-4a70-b00b-24b6861f2fff")) {
          state.outdoor.loading = true;
          state.outdoor.error = null;
        } else if (meta.arg.sensorIds.includes("e025317f-31ac-407e-b623-717cb7b9fcee")) {
          state.indoor.loading = true;
          state.indoor.error = null;
        } else if (meta.arg.sensorIds.includes("89101239-7002-402d-a149-68b5acc672a5")) {
          state.supply.loading = true;
          state.supply.error = null;
        } else if (meta.arg.sensorIds.includes("your-return-sensor-id")) {
          state.return.loading = true;
          state.return.error = null;
        }
      })
      .addCase(fetchBatchSensorData.fulfilled, (state, action) => {
        const { meta, payload } = action;
        if (meta.arg.sensorIds.includes("3516f208-56cc-4a70-b00b-24b6861f2fff")) {
          state.outdoor = { sensorData: payload, loading: false, error: null };
        } else if (meta.arg.sensorIds.includes("e025317f-31ac-407e-b623-717cb7b9fcee")) {
          state.indoor = { sensorData: payload, loading: false, error: null };
        } else if (meta.arg.sensorIds.includes("89101239-7002-402d-a149-68b5acc672a5")) {
          state.supply = { sensorData: payload, loading: false, error: null };
        } else if (meta.arg.sensorIds.includes("your-return-sensor-id")) {
          state.return = { sensorData: payload, loading: false, error: null };
        }
      })
      .addCase(fetchBatchSensorData.rejected, (state, action) => {
        const { meta, payload } = action;
        if (meta.arg.sensorIds.includes("3516f208-56cc-4a70-b00b-24b6861f2fff")) {
          state.outdoor = { sensorData: [], loading: false, error: payload as string };
        } else if (meta.arg.sensorIds.includes("e025317f-31ac-407e-b623-717cb7b9fcee")) {
          state.indoor = { sensorData: [], loading: false, error: payload as string };
        } else if (meta.arg.sensorIds.includes("89101239-7002-402d-a149-68b5acc672a5")) {
          state.supply = { sensorData: [], loading: false, error: payload as string };
        } else if (meta.arg.sensorIds.includes("your-return-sensor-id")) {
          state.return = { sensorData: [], loading: false, error: payload as string };
        }
      });
  },
});

export default sensorDataSlice.reducer;