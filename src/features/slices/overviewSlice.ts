import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "@/utils/fetch";
import { RootState, AppDispatch } from "@/features/store/store";
import { BuildingsResponse, SensorDomain } from "../models/sensor-data"; // Dina modeller
import { AuthContentData } from "../models/auth";

// Typ för slice state
interface OverviewState {
  buildings: BuildingsResponse | null; // Data för byggnader
  sensorDomains: SensorDomain[] | null; // Data för sensor-domäner
  loading: boolean; // Anger om hämtning pågår
  error: string | null; // Felmeddelande vid misslyckande
}

// Initialt state
const initialState: OverviewState = {
  buildings: null,
  sensorDomains: null,
  loading: false,
  error: null,
};

// AsyncThunk för att hämta byggnader
export const fetchBuildings = createAsyncThunk<
  BuildingsResponse,
  string,
  { state: RootState; dispatch: AppDispatch }
>("overview/fetchBuildings", async (id, { getState, dispatch }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await authFetch(
      `${apiUrl}/open/v1/sensor_domains/${id}/buildings`,
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
    return responseJson as BuildingsResponse;
  } catch (error) {
    console.error("Fel vid hämtning av byggnader:", error);
    throw error;
  }
});

// AsyncThunk för att hämta sensor-domäner
export const fetchSensorDomains = createAsyncThunk<
  SensorDomain[],
  { offset: number; limit: number; auth: AuthContentData },
  { state: RootState; dispatch: AppDispatch }
>(
  "overview/fetchSensorDomains",
  async ({ offset, limit, auth }, { getState, dispatch }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });

    try {
      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains?${params}`,
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
      return responseJson as SensorDomain[];
    } catch (error) {
      console.error("Fel vid hämtning av sensor-domäner:", error);
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
      // Hantering av fetchBuildings
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBuildings.fulfilled,
        (state, action: PayloadAction<BuildingsResponse>) => {
          state.loading = false;
          state.buildings = action.payload;
        }
      )
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Ett fel uppstod vid hämtning av byggnader.";
      })

      // Hantering av fetchSensorDomains
      .addCase(fetchSensorDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSensorDomains.fulfilled,
        (state, action: PayloadAction<SensorDomain[]>) => {
          state.loading = false;
          state.sensorDomains = action.payload;
        }
      )
      .addCase(fetchSensorDomains.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Ett fel uppstod vid hämtning av sensor-domäner.";
      });
  },
});

export default overviewSlice.reducer;
