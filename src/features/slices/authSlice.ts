import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthAccount, AuthCredentials, AuthResponse } from "../models/auth";
import { AppDispatch, RootState } from "../store/store";

interface AuthState {
  isLoggedIn: boolean;
  account: AuthAccount | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  hasInitiatedLocalAccount: boolean;
  isOnboardingDone: boolean | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  account: null,
  token: null,
  loading: false,
  error: null,
  hasInitiatedLocalAccount: false,
  isOnboardingDone: null,
};

export const fetchUserFromToken = createAsyncThunk<
  AuthResponse,
  AuthCredentials,
  { state: RootState; dispatch: AppDispatch }
>("auth/fetchUserFromToken", async (credentials, { rejectWithValue }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    console.log("Attempting to fetch user with credentials:", credentials);
    const response = await fetch(`${apiUrl}/v1/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      console.error("API response not OK. Status:", response.status);
      throw new Error("Login failed");
    }

    const data: AuthResponse = await response.json();
    console.log("Fetch succeeded. Data:", data);
    return data;
  } catch (error: any) {
    console.error("Fetch failed:", error.message);
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      console.log("Login reducer triggered with payload:", action.payload);
      state.isLoggedIn = true;
      state.account = action.payload.account;
      state.token = action.payload.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        console.log("Token saved to localStorage:", action.payload.accessToken);
      }
    },
    logout: (state) => {
      console.log("Logout reducer triggered");
      state.isLoggedIn = false;
      state.account = null;
      state.token = null;
      state.hasInitiatedLocalAccount = false;
      state.isOnboardingDone = null;
    },
    setOnboardingDone: (state, action: PayloadAction<boolean>) => {
      console.log("setOnboardingDone triggered with payload:", action.payload);
      state.isOnboardingDone = action.payload;
    },
    setLocalAccountInitiated: (state, action: PayloadAction<boolean>) => {
      console.log(
        "setLocalAccountInitiated triggered with payload:",
        action.payload
      );
      state.hasInitiatedLocalAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromToken.pending, (state) => {
        console.log("fetchUserFromToken.pending triggered");
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserFromToken.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          console.log(
            "fetchUserFromToken.fulfilled triggered with payload:",
            action.payload
          );
          state.loading = false;
          state.isLoggedIn = true;
          state.account = action.payload.account;
          state.token = action.payload.accessToken;
        }
      )
      .addCase(
        fetchUserFromToken.rejected,
        (state, action: PayloadAction<any>) => {
          console.log(
            "fetchUserFromToken.rejected triggered with payload:",
            action.payload
          );
          state.loading = false;
          state.error = action.payload;
          state.isLoggedIn = false;
          state.account = null;
          state.token = null;
        }
      );
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
