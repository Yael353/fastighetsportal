import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { SensorDomain } from "../models/sensor-data";
import { RootState, AppDispatch } from "../store/store";
import { authFetch } from "@/utils/fetch";


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
  { offset: number; limit: number },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "overview/getList",
  async ({ offset, limit }, { dispatch, rejectWithValue }) => {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains?${params}`,
        { method: "GET" },
        dispatch
      );

      // ${params}

      const responseJson = await response.json();
      // console.log("Fetched sensor domains:", responseJson);
      return responseJson as SensorDomain[];
    } catch (error: any) {
      // console.error("Error fetching sensor domains:", error.message || error);
      return rejectWithValue(
        error.message || "Ett fel uppstod vid hämtning av sensor-domäner"
      );
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
        // console.log("Fetching sensor domains...");
      })
      .addCase(
        getList.fulfilled,
        (state, action: PayloadAction<SensorDomain[]>) => {
          state.loading = false;
          state.sensorDomains = action.payload;
          // console.log("Sensor domains fetched successfully");
          // console.log("Sensor domains fetched successfully:", action.payload);
        }
      )
      .addCase(getList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel uppstod vid hämtning av sensor-domäner";
        // console.error("Error fetching sensor domains:", state.error);
      });
  },
});

export default overviewSlice.reducer;
