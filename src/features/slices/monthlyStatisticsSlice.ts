import { createSlice } from "@reduxjs/toolkit";
import { MonthlyApartmentStatisticsResponse } from "../models/statistics";
import { fetchMonthlyApartmentStatistics } from "../thunks/fetchSensors";


interface MonthlyStatisticsState {
  data: MonthlyApartmentStatisticsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: MonthlyStatisticsState = {
  data: null,
  loading: false,
  error: null,
};

const monthlyStatisticsSlice = createSlice({
  name: "monthlyStatistics",
  initialState,
  reducers: {
    clearMonthlyStatistics: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyApartmentStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyApartmentStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMonthlyApartmentStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Misslyckades att hämta data.";
      });
  },
});

export const { clearMonthlyStatistics } = monthlyStatisticsSlice.actions;
export default monthlyStatisticsSlice.reducer;
