import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchSummaryApartmentStatistics } from "../thunks/fetchSensors";
import { SummarySensorDomainApartmentStatisticsResponse } from "../models/statistics";

interface SummaryStatisticsState {
  data: SummarySensorDomainApartmentStatisticsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: SummaryStatisticsState = {
  data: null,
  loading: false,
  error: null,
};

const summaryStatisticsSlice = createSlice({
  name: "summaryStatistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummaryApartmentStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSummaryApartmentStatistics.fulfilled,

        (
          state,
          action: PayloadAction<SummarySensorDomainApartmentStatisticsResponse>
        ) => {
          // console.log("Fetch Summary Fulfilled Payload:", action.payload);
          state.loading = false;
          state.data = action.payload;
        }
      )

      .addCase(fetchSummaryApartmentStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "Ett oväntat fel inträffade vid hämtning av sammanfattningsstatistik.";
      });
  },
});

export default summaryStatisticsSlice.reducer;
