import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authFetch } from "@/utils/fetch";
import { RootState, AppDispatch } from "@/features/store/store";
import { BuildingsResponse, SensorDomain } from "../models/sensor-data"; // Dina modeller
import { getAuthToken } from "@/utils/auth";

// Typ för slice state
interface OverviewState {
  buildings: BuildingsResponse | null;
  sensorDomains: SensorDomain[] | null;
  loading: boolean;
  error: string | null;
}

// Initialt state
const initialState: OverviewState = {
  buildings: null,
  sensorDomains: [] as SensorDomain[],
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
    console.log(`Fetching buildings for ID: ${id}`);
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

    console.log("Response status:", response.status);

    if (response.status === 404) {
      throw new Error("Fel uppgifter, prova igen (404)");
    } else if (response.status === 403) {
      throw new Error("Åtkomst nekad (403)");
    }

    const responseJson = await response.json();
    console.log("Fetched buildings data:", responseJson);
    return responseJson as BuildingsResponse;
  } catch (error) {
    console.error("Error fetching buildings:", error);
    throw error;
  }
});

// AsyncThunk för att hämta sensor-domäner
export const fetchSensorDomains = createAsyncThunk<
  SensorDomain[],
  { offset: number; limit: number },
  { state: RootState; dispatch: AppDispatch }
>(
  "overview/fetchSensorDomains",
  async ({ offset, limit }, { getState, dispatch }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    });
    const token = getAuthToken();

    if (!token) {
      throw new Error("Token saknas. Kan inte autentisera begäran.");
    }
    try {
      console.log(
        `Fetching sensor domains with offset=${offset} and limit=${limit}`
      );
      const response = await authFetch(
        `${apiUrl}/open/v1/sensor_domains?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
        getState,
        dispatch
      );

      console.log("Response status:", response.status);

      if (response.status === 404) {
        throw new Error("Fel uppgifter, prova igen (404)");
      } else if (response.status === 403) {
        throw new Error("Åtkomst nekad (403)");
      }

      const responseJson = await response.json();
      console.log("Fetched sensor domains data:", responseJson);
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
      // Hantering av fetchBuildings
      .addCase(fetchBuildings.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching buildings...");
      })
      .addCase(
        fetchBuildings.fulfilled,
        (state, action: PayloadAction<BuildingsResponse>) => {
          state.loading = false;
          state.buildings = action.payload;
          console.log("Buildings fetched successfully");
        }
      )
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Ett fel uppstod vid hämtning av byggnader.";
        console.error("Error fetching buildings:", action.error.message);
      })

      // Hantering av fetchSensorDomains
      .addCase(fetchSensorDomains.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Fetching sensor domains...");
      })
      .addCase(
        fetchSensorDomains.fulfilled,
        (state, action: PayloadAction<SensorDomain[]>) => {
          state.loading = false;
          state.sensorDomains = action.payload || []; // Om payload är null eller undefined, sätt tom array
          console.log("Sensor domains fetched successfully");
        }
      )
      .addCase(fetchSensorDomains.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Ett fel uppstod vid hämtning av sensor-domäner.";
        console.error("Error fetching sensor domains:", action.error.message);
      });
  },
});

export default overviewSlice.reducer;
