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
  { offset?: number; limit?: number } | undefined, // 🔹 Gör argumenten valfria
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "overview/getList",
  async ({ offset, limit } = {}, { dispatch, rejectWithValue }) => {
    // 🔹 Default till tomt objekt
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      // 🔹 Skapa URL baserat på om offset och limit finns
      let url = `${apiUrl}/open/v1/sensor_domains`;
      if (offset !== undefined && limit !== undefined) {
        url += `?offset=${offset}&limit=${limit}`;
      }

      const response = await authFetch(url, { method: "GET" }, dispatch);
      const responseJson = await response.json();

      // console.log("responseJson ", responseJson);
      return responseJson as SensorDomain[];
    } catch (error: any) {
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
      })
      .addCase(
        getList.fulfilled,
        (state, action: PayloadAction<SensorDomain[]>) => {
          state.loading = false;
          state.sensorDomains = action.payload;
        }
      )
      .addCase(getList.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Ett fel uppstod vid hämtning av sensor-domäner";
      });
  },
});

export default overviewSlice.reducer;
