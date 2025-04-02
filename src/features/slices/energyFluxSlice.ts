import { createSlice } from "@reduxjs/toolkit";
import { EnergyFluxParametersResponse } from "../models/energy-flux-parameters";
import {
  fetchEnergyFlux,
  postEnergyFlux,
} from "../thunks/energyFluxParameters";

interface EnergyFluxState {
  data: Record<string, EnergyFluxParametersResponse | null>; // Lägg till | null
  loading: boolean;
  error: string | null;
}

const initialState: EnergyFluxState = {
  data: {},
  loading: false,
  error: null,
};

const energyFluxSlice = createSlice({
  name: "energyFlux",
  initialState,
  reducers: {
    clearEnergyFluxError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnergyFlux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnergyFlux.fulfilled, (state, action) => {
        state.loading = false;
        const controllerId = action.meta.arg.controllerId;

        if (!action.payload) {
          state.data[controllerId] = null;
        } else {
          state.data[controllerId] = action.payload;
        }
      })
      .addCase(fetchEnergyFlux.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Ett fel inträffade vid hämtning av energiflödesparametrar";
      })
      .addCase(postEnergyFlux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postEnergyFlux.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const controllerId = action.payload.communication_controller_id;
        state.data[controllerId] = action.payload;
      })
      .addCase(postEnergyFlux.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Ett fel inträffade vid sparande av energiflödesparametrar";
      });
  },
});

export default energyFluxSlice.reducer;
export const { clearEnergyFluxError } = energyFluxSlice.actions;
