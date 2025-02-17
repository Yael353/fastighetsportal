import { createSlice } from "@reduxjs/toolkit";
import { fetchApartmentConsumptionLastXDays } from "../thunks/fetchSensors";
import { AllApartmentConsumptionResponse } from "../models/sensor-data";

interface ApartmentState {
  data: AllApartmentConsumptionResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApartmentState = {
  data: null,
  loading: false,
  error: null,
};

const apartmentSlice = createSlice({
  name: "apartments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApartmentConsumptionLastXDays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchApartmentConsumptionLastXDays.fulfilled,
        (state, action) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchApartmentConsumptionLastXDays.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel inträffade vid hämtning av data.";
      });
  },
});

export default apartmentSlice.reducer;
