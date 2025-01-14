import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../store/store";
import { authFetch } from "@/utils/fetch";
import { SensorDomain } from "../models/sensor-data";
import { fetchSensorDomain } from "../thunks/fetchSensors";

interface ResidentialState {
  data: SensorDomain | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResidentialState = {
  data: null,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensorDomain.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSensorDomain.fulfilled,
        (state, action: PayloadAction<SensorDomain>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchSensorDomain.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Thunk använder rejectValue
      });
  },
});

export default propertySlice.reducer;
