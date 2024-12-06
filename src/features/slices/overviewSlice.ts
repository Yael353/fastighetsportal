import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SensorDomain } from "../models/sensor-data";
import { RootState, AppDispatch } from "../store/store";
import { AuthContentData } from "../models/auth";

// Typ för slice state
interface OverviewState {
  sensorDomains: SensorDomain[] | null;
  loading: boolean;
  error: string | null;
}

// Initialt state
const initialState: OverviewState = {
  sensorDomains: null,
  loading: false,
  error: null,
};

// AsyncThunk för att hämta sensor-domäner
export const getList = createAsyncThunk<
  SensorDomain[],
  { offset: number; limit: number; auth: AuthContentData },
  { state: RootState; dispatch: AppDispatch }
>(
  "overview/getList",
  async ({ offset, limit, auth }, { getState, dispatch }) => {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(
        `${apiUrl}/open/v1/sensor_domains?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        throw new Error("Fel uppgifter, prova igen");
      } else if (response.status === 403) {
        throw new Error("Åtkomst nekad (403)");
      }

      const responseJson = await response.json();
      return responseJson as SensorDomain[];
    } catch (error) {
      console.error("Error fetching sensor domains:", error);
      throw error;
    }
  }
);

// Slice
const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching sensor domains...");
      })
      .addCase(
        getList.fulfilled,
        (state, action: PayloadAction<SensorDomain[]>) => {
          state.loading = false;
          state.sensorDomains = action.payload;
          console.log("Sensor domains fetched successfully");
        }
      )
      .addCase(getList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Ett fel uppstod vid hämtning av sensor-domäner";
        console.error("Error fetching sensor domains:", action.error.message);
      });
  },
});

export default overviewSlice.reducer;
