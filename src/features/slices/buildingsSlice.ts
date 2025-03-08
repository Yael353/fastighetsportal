import { createSlice } from "@reduxjs/toolkit";
import { BuildingsResponse } from "../models/sensor-data";
import { fetchBuildings } from "../thunks/fetchSensors";

interface BuildingsState {
  data: BuildingsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: BuildingsState = {
  data: null,
  loading: false,
  error: null,
};

const buildingsSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        // console.log("Payload:", action.payload);
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ett fel inträffade";
      });
  },
});

export const buildingsReducer = buildingsSlice.reducer;
