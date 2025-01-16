import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import propertyReducer from "../slices/propertySlice";
import overviewReducer from "@/features/slices/overviewSlice";
import sensorDataReducer from "@/features/slices/batchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    overview: overviewReducer,
    property: propertyReducer,
    sensorData: sensorDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
