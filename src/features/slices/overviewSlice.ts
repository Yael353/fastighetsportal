import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "@/utils/fetch"; // Använd authFetch för att hantera token
import { RootState, AppDispatch } from "@/features/store/store";
import { BuildingsResponse } from "../models/sensor-data"; // Modell för byggnadsdata

interface OverviewState {
  buildings: BuildingsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: OverviewState = {
  buildings: null,
  loading: false,
  error: null,
};

export const fetchBuildings = createAsyncThunk<
  BuildingsResponse,
  string,
  { state: RootState; dispatch: AppDispatch }
>("overview/fetchBuildings", async (id, { getState, dispatch }: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await authFetch(
      `${apiUrl}/open/v1/sensor_domains?offset=0&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      getState,
      dispatch
    );

    if (response.status === 404) {
      throw new Error("Fel uppgifter, prova igen (404)");
    } else if (response.status === 403) {
      throw new Error("Åtkomst nekad (403)");
    }

    const responseJson = await response.json();
    console.log("API", responseJson);
    return responseJson as BuildingsResponse;
  } catch (error) {
    console.error("Fel vid hämtning av byggnader:", error);
    throw error;
  }
});

const overviewSlice = createSlice({
  name: "overview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBuildings.fulfilled,
        (state, action: PayloadAction<BuildingsResponse>) => {
          console.log("Fetched buildings data:", action.payload);
          state.loading = false;
          state.buildings = action.payload;
        }
      )

      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        console.log("Fetch buildings failed:");
        console.log("Error message:", action.error.message);
        console.log("Error code:", action.error.code); // Om det finns en kod
        console.log("Full action object:", action);
        state.error = action.error.message || "Ett fel uppstod.";
      });
  },
});

export default overviewSlice.reducer;
