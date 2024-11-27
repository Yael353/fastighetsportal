import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthAccount, AuthCredentials, AuthResponse } from "../models/auth"; // Importera AuthResponse
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
  AuthResponse, // Return typ
  AuthCredentials, // Typ för inparametrar
  { state: RootState; dispatch: AppDispatch } // Extra argument
>("auth/fetchUserFromToken", async (credentials) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    // Använd ett vanligt fetch-anrop för inloggning
    const response = await fetch(`${apiUrl}/v1/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data: AuthResponse = await response.json();

    // Returnera inloggningsdata (inkl. token)
    console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      state.isLoggedIn = true;
      state.account = action.payload.account;
      state.token = action.payload.accessToken;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.account = null;
      state.token = null;
      state.hasInitiatedLocalAccount = false;
      state.isOnboardingDone = null;
    },
    setOnboardingDone: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingDone = action.payload;
    },
    setLocalAccountInitiated: (state, action: PayloadAction<boolean>) => {
      state.hasInitiatedLocalAccount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserFromToken.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.account = action.payload.account;
          state.token = action.payload.accessToken;
        }
      )

      .addCase(
        fetchUserFromToken.rejected,
        (state, action: PayloadAction<any>) => {
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
