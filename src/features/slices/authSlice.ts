import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthCredentials, AuthResponse } from "../models/auth"; // Importera AuthResponse
import { RESPONSE_403, RESPONSE_404 } from "../errors/errors";

interface AuthState {
  isLoggedIn: boolean;
  account: {
    accountId: string;
    name: string;
    description: string;
    contact: string;
    userType: string;
    orgId: string;
    orgName: string;
    isNew: boolean;
    tags: string[];
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  account: null,
  token: null,
  loading: false,
  error: null,
};

// AsyncThunk för att autentisera användaren med inloggningsuppgifter
export const fetchUserFromToken = createAsyncThunk(
  "auth/fetchUserFromToken",
  async (credentials: AuthCredentials): Promise<AuthResponse> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${apiUrl}/v1/auth`, {
        // API URL här
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.status === 404) {
        throw new RESPONSE_404("Fel uppgifter, prova igen");
      } else if (response.status === 403) {
        throw new RESPONSE_403("Fel uppgifter, prova igen");
      }

      const data = await response.json();
      return data; // Returnerar AuthResponse med account och accessToken
    } catch (error) {
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      // Här sparas användarens information och token
      state.isLoggedIn = true;
      state.account = action.payload.account;
      state.token = action.payload.accessToken;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.account = null;
      state.token = null;
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
