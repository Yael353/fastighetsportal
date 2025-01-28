import { createSlice } from "@reduxjs/toolkit";
import { postAlgoConfig, fetchAlgoConfig } from "../thunks/algoConfig";
import { AlgoConfigResponse } from "../models/algo-config";

interface AlgoConfigState {
  data: AlgoConfigResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlgoConfigState = {
  data: null,
  loading: false,
  error: null,
};

const algoConfigSlice = createSlice({
  name: "algoConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlgoConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlgoConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAlgoConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ett oväntat fel inträffade.";
      });

    builder
      .addCase(postAlgoConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAlgoConfig.fulfilled, (state, action) => {
        console.log("Fetched AlgoConfig:", action.payload);
        state.loading = false;
        state.data = action.payload; // Uppdatera med den nya datan om nödvändigt
      })
      .addCase(postAlgoConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ett ovantät fel inträffade.";
      });
  },
});

export default algoConfigSlice.reducer;
