import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  user: { id: string; email: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};

// AsyncThunk för autentisering
export const fetchUserFromToken = createAsyncThunk(
  "auth/fetchUserFromToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(``, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Invalid token");
      }
      const data = await response.json();
      return data; // Returnera användarinfo, t.ex. { id, email }
    } catch (error) {
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
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
        (state, action: PayloadAction<{ id: string; email: string }>) => {
          state.loading = false;
          state.isLoggedIn = true;
          state.user = action.payload;
        }
      )
      .addCase(
        fetchUserFromToken.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
          state.isLoggedIn = false;
          state.user = null;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
