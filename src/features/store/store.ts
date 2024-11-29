import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import propertyReducer from "../slices/propertySlice";
import overviewReducer from "@/features/slices/overviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    overview: overviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
