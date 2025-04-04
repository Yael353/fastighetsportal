import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import propertyReducer from "../slices/propertySlice";
import overviewReducer from "../slices/overviewSlice";
import sensorDataReducer from "../slices/batchSlice";
import { buildingsReducer } from "../slices/buildingsSlice";
import apartmentReducer from "../slices/ApartmentConsumptionSlice";
import summaryStatisticsReducer from "../slices/summaryStatisticsSlice";
import algoConfigReducer from "../slices/algoConfigSlice";
import monthlyStatisticsReducer from "../slices/monthlyStatisticsSlice";
import energyFluxReducer from "../slices/energyFluxSlice";
import chartsSensorReducer from "../slices/chartsSensorSlice";

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
    monthlyStatistics: monthlyStatisticsReducer,
    energyFlux: energyFluxReducer,
    chartsSensorData: chartsSensorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
