import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import propertyReducer from "../slices/propertySlice";
import overviewReducer from "@/features/slices/overviewSlice";
import sensorDataReducer from "@/features/slices/batchSlice";
import { buildingsReducer } from "../slices/buildingsSlice";
import apartmentReducer from "@/features/slices/ApartmentConsumptionSlice";
import summaryStatisticsReducer from "@/features/slices/summaryStatisticsSlice";
import algoConfigReducer from "@/features/slices/algoConfigSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    overview: overviewReducer,
    property: propertyReducer,
    sensorData: sensorDataReducer,
    buildings: buildingsReducer,
    apartmentConsumption: apartmentReducer,
    summaryStatistics: summaryStatisticsReducer,
    algoConfig: algoConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
