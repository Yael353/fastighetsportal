import { EnergyFluxParametersResponse } from "../models/energy-flux-parameters";
import { RESPONSE_403, RESPONSE_404 } from "../errors/errors";
import { AppDispatch, RootState } from "../store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "@/utils/fetch";
import { clearEnergyFluxError } from "../slices/energyFluxSlice";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchEnergyFlux = createAsyncThunk<
  EnergyFluxParametersResponse | null,
  { controllerId: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "energyFlux/fetch",
  async ({ controllerId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(clearEnergyFluxError());
      const response = await authFetch(
        `${apiUrl}/open/v1/energy_flux_parameters/${controllerId}`,
        { method: "GET" },
        dispatch
      );
      if (response.status === 404) {
        return null;
      }
      if (response.status === 403) {
        throw new RESPONSE_403("Åtkomst nekad");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // // Logga endast oväntade fel
      // if (!(error instanceof RESPONSE_404)) {
      //   console.error("Error fetching energy flux:", error);
      // }

      // if (error instanceof RESPONSE_403) {
      //   return rejectWithValue(error.message);
      // }

      return rejectWithValue(
        error instanceof Error ? error.message : "Ett oväntat fel inträffade"
      );
    }
  }
);

interface PostEnergyFluxArgs {
  controllerId: string;
  window: number;
  wall: number;
  offset: number;
}

export const postEnergyFlux = createAsyncThunk<
  EnergyFluxParametersResponse,
  PostEnergyFluxArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("energyFlux/postConfig", async (args, { dispatch, rejectWithValue }) => {
  try {
    const response = await authFetch(
      `${apiUrl}/open/v1/energy_flux_parameters`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communication_controller_id: args.controllerId,
          window: args.window,
          wall: args.wall,
          offset: args.offset,
        }),
      },
      dispatch
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new RESPONSE_403("Åtkomst nekad");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (!(error instanceof RESPONSE_404)) {
      console.error("Error posting energy flux:", error);
    }

    if (error instanceof RESPONSE_403 || error instanceof RESPONSE_404) {
      return rejectWithValue(error.message);
    }

    return rejectWithValue(
      error instanceof Error ? error.message : "Ett oväntat fel inträffade"
    );
  }
});
