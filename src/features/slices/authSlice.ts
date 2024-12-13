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
}

const initialState: AuthState = {
  isLoggedIn: false,
  account: null,
  token: null,
  loading: false,
  error: null,
  hasInitiatedLocalAccount: false,
};

// AsyncThunk för att hämta autentisering från servern.
export const authenticateUser = createAsyncThunk<
  AuthResponse,
  AuthCredentials,
  { state: RootState; dispatch: AppDispatch }
>("auth/authenticateUser", async (credentials, { rejectWithValue }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/v1/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed with status: ${response.status}`);
    }

    const data: AuthResponse = await response.json();
    console.log("Svar från auth-anropet: ", data);

    return {
      ...data,
      access_token: data.access_token, // Mappa om här
    };
  } catch (error: any) {
    // console.error("Fel under autentisering:", error.message);
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      state.isLoggedIn = true;
      state.account = action.payload.account;
      state.token = action.payload.access_token;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "accessToken",
          action.payload.access_token || "null"
        );
        localStorage.setItem("account", JSON.stringify(action.payload.account));
        window.location.href = "/dashboard";
      }
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.account = null;
      state.token = null;
      state.hasInitiatedLocalAccount = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("account");
        localStorage.setItem("logout", Date.now().toString());
        window.location.href = "/";
      }
    },

    initializeFromLocalStorage: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        const account = localStorage.getItem("account");

        if (token && account) {
          state.token = token;
          state.account = JSON.parse(account);
          state.isLoggedIn = true;
        } else {
          state.hasInitiatedLocalAccount = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        authenticateUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          console.log("Autentisering lyckades:", action.payload);
          state.loading = false;
          state.isLoggedIn = true;
          state.account = action.payload.account;
          state.token = action.payload.access_token;

          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", action.payload.access_token);
            localStorage.setItem(
              "account",
              JSON.stringify(action.payload.account)
            );
          }
        }
      )
      .addCase(
        authenticateUser.rejected,
        (state, action: PayloadAction<any>) => {
          // console.error("Autentisering misslyckades:", action.payload);
          state.loading = false;
          state.error = action.payload;
          state.isLoggedIn = false;
          state.account = null;
          state.token = null;
        }
      );
  },
});

export const { login, logout, initializeFromLocalStorage } = authSlice.actions;
export default authSlice.reducer;
