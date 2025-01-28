import { AlgoConfigResponse } from "../models/algo-config";
import { RESPONSE_403, RESPONSE_404 } from "../errors/errors";
import { AppDispatch, RootState } from "../store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { authFetch } from "@/utils/fetch";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchAlgoConfig = createAsyncThunk<
  AlgoConfigResponse,
  { controllerId: string },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "algoConfig/fetch",
  async ({ controllerId }, { dispatch, rejectWithValue }) => {
    try {
      console.debug("Fetching algo config for controller ID:", controllerId);
      console.log(`Request URL: ${apiUrl}/open/v1/algo_config/${controllerId}`);

      // Anropa API:et med authFetch
      const response = await authFetch(
        `${apiUrl}/open/v1/algo_config/${controllerId}`,
        { method: "GET" },
        dispatch
      );

      // Kontrollera HTTP-status
      if (response.status === 404) {
        throw new RESPONSE_404("Fel uppgifter, prova igen");
      } else if (response.status === 403) {
        throw new RESPONSE_403("Fel uppgifter, prova igen");
      }

      console.log("Response status:", response.status);
      // Parsar JSON-svaret
      const responseJson = await response.json();
      console.log("Parsed API response JSON:", responseJson);

      return responseJson as AlgoConfigResponse;
    } catch (error: any) {
      console.error("Error fetching algo config:", error.message || error);

      // Hantera specifika fel och returnera användarvänliga meddelanden
      if (error instanceof RESPONSE_404 || error instanceof RESPONSE_403) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid hämtning av algoritmkonfiguration."
      );
    }
    
  }
);
console.log("Test log to check console visibility");

interface PostAlgoConfigArgs {
  controllerId: string;
  comfortConstant: number;
  sunConstant: number;
  iatSp: number;
}

export const postAlgoConfig = createAsyncThunk<
  AlgoConfigResponse,
  PostAlgoConfigArgs,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  "algoConfig/postConfig",
  async (
    { controllerId, comfortConstant, sunConstant, iatSp },
    { dispatch, rejectWithValue }
  ) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      console.log("Posting algo config:", {
        controllerId,
        comfortConstant,
        sunConstant,
        iatSp,
      });
      console.log(`Request URL: ${apiUrl}/open/v1/algo_config`);

      const response = await authFetch(
        `${apiUrl}/open/v1/algo_config`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            communication_controller_id: controllerId,
            comfort_constant: comfortConstant,
            sun_constant: sunConstant,
            iat_sp: iatSp,
          }),
        },
        dispatch
      );

      console.log("Raw response:", response);

      if (response.status === 404) {
        throw new RESPONSE_404("Fel uppgifter, prova igen");
      } else if (response.status === 403) {
        throw new RESPONSE_403("Fel uppgifter, prova igen");
      }

      const responseJson = await response.json();
      console.log("Parsed API response JSON:", responseJson);

      return responseJson as AlgoConfigResponse;
    } catch (error: any) {
      console.error("Error posting algo config:", error.message || error);

      if (error.message.includes("404") || error.message.includes("403")) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        error.message ||
          "Ett oväntat fel inträffade vid postning av algoritmkonfiguration."
      );
    }
  }
);
