import { createSlice } from "@reduxjs/toolkit";
import { postAlgoConfig, fetchAlgoConfig } from "../thunks/algoConfig";
import { AlgoConfigResponse } from "../models/algo-config";

interface AlgoConfigState {
  data: Record<string, AlgoConfigResponse | null>;
  loading: boolean;
  error: string | null;
}

const initialState: AlgoConfigState = {
  data: {},
  loading: false,
  error: null,
};

const algoConfigSlice = createSlice({
  name: "algoConfig",
  initialState,
  reducers: {
    clearAlgoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlgoConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlgoConfig.fulfilled, (state, action) => {
        state.loading = false;
        const controllerId = action.meta.arg.controllerId;

        if (!action.payload) {
          state.data[controllerId] = null;
        } else {
          state.data[controllerId] = action.payload;
        }
      })

      .addCase(fetchAlgoConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ett oväntat fel inträffade.";
      })
      .addCase(postAlgoConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAlgoConfig.fulfilled, (state, action) => {
        state.loading = false;
        const controllerId = action.payload.communication_controller_id;
        state.data[controllerId] = action.payload;
      })
      .addCase(postAlgoConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ett oväntat fel inträffade.";
      });
  },
});

export default algoConfigSlice.reducer;
export const { clearAlgoError } = algoConfigSlice.actions;
