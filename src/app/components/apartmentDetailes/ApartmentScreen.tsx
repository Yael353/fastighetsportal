import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import moment from "moment";
import { AppDispatch, RootState } from "@/features/store/store";
import {
  fetchApartmentConsumptionLastXDays,
  fetchBuildings,
  fetchMonthlyApartmentStatistics,
  fetchBatchSensorData,
} from "@/features/thunks/fetchSensors";
import {
  BatchSensorDataResponse,
  BatchSensorDataFreq,
} from "@/features/models/sensor-data";

import MonthlyStatistics from "./MonthlyStatistics";
import ElectricityChart from "./ElectricityChart";
import HotWaterChart from "./HotWaterChart";
import TemperatureChart from "./TemperatureChart";
import { MdOutlineElectricalServices } from "react-icons/md";
import { FaHandHoldingWater } from "react-icons/fa";
import { FaTemperatureHigh } from "react-icons/fa";

export default function ApartmentScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { id: sensorDomainId, apartmentId } = useParams();
  const [selectedDays, setSelectedDays] = useState(1);
  const [batchData, setBatchData] = useState<BatchSensorDataResponse[] | null>(
    null
  );
  const [activeView, setActiveView] = useState<
    "temperature" | "electricity" | "hotWater" | "monthlyStatistics"
  >("temperature");

  const buildings = useSelector(
    (state: RootState) => state.buildings.data ?? {}
  );
  const buildingsLoading = useSelector(
    (state: RootState) => state.buildings.loading
  );
  const buildingsError = useSelector(
    (state: RootState) => state.buildings.error
  );
  const monthlyStatistics = useSelector(
    (state: RootState) => state.monthlyStatistics.data
  );
  const monthlyLoading = useSelector(
    (state: RootState) => state.monthlyStatistics.loading
  );
  const monthlyError = useSelector(
    (state: RootState) => state.monthlyStatistics.error
  );

  const apartmentConsumption = useSelector(
    (state: RootState) => state.apartmentConsumption.data?.data
  );
  const apartmentConsumptionLoading = useSelector(
    (state: RootState) => state.apartmentConsumption.loading
  );
  const apartmentConsumptionError = useSelector(
    (state: RootState) => state.apartmentConsumption.error
  );

  useEffect(() => {
    if (typeof sensorDomainId === "string" && !Array.isArray(sensorDomainId)) {
      if (!buildings || Object.keys(buildings).length === 0) {
        dispatch(fetchBuildings({ id: sensorDomainId }));
      }
    }
  }, [sensorDomainId, dispatch]);

  const buildingId = useMemo(() => {
    if (!buildings || Object.keys(buildings).length === 0) return null;
    return Object.values(buildings).find((building) =>
      building.apartments?.some((apartment) => apartment.apt_id === apartmentId)
    )?.building_id;
  }, [buildings, apartmentId]);

  useEffect(() => {
    if (
      typeof sensorDomainId === "string" &&
      !Array.isArray(sensorDomainId) &&
      typeof buildingId === "string" &&
      typeof apartmentId === "string"
    ) {
      dispatch(
        fetchMonthlyApartmentStatistics({
          sensorDomainId,
          buildingId,
          apartmentId,
          days_interval: 30,
        } as any)
      );
      dispatch(
        fetchApartmentConsumptionLastXDays({
          sensorDomainId,
          buildingId,
          apartmentId,
          days_interval: 30,
        })
      );
    }
  }, [sensorDomainId, buildingId, apartmentId, dispatch]);

  const sensorIds = useMemo(
    () => apartmentConsumption?.map((item) => item.id) || [],
    [apartmentConsumption]
  );

  useEffect(() => {
    if (typeof sensorDomainId === "string" && sensorIds.length > 0) {
      dispatch(
        fetchBatchSensorData({
          sensorDomainId,
          sensorIds,
          startUtc: moment().utc().subtract(selectedDays, "days"),
          endUtc: moment().utc(),
          freq: BatchSensorDataFreq.raw,
        })
      )
        .unwrap()
        .then(setBatchData)
        .catch(console.error);
    }
  }, [sensorDomainId, sensorIds, selectedDays, dispatch]);

  if (buildingsLoading) {
    return (
      <div className="flex justify-center text-neonBlueLight">
        Laddar byggnader...
      </div>
    );
  }
  if (buildingsError) {
    return (
      <div className="flex justify-center text-neonBlueLight">
        Fel vid hämtning av byggnader: {buildingsError}
      </div>
    );
  }
  if (!buildingId) {
    return (
      <div className="flex justify-center text-neonBlueLight">
        Byggnad kunde inte hittas för lägenhet: {apartmentId}
      </div>
    );
  }

  const building = Object.values(buildings).find(
    (b) => b.building_id === buildingId
  );
  const apartment = building?.apartments.find((a) => a.apt_id === apartmentId);

  const temperatureData = apartmentConsumption?.find(
    (item) => item.vala_description.measurement_type === "temp"
  );
  const electricityData = apartmentConsumption?.find(
    (item) => item.vala_description.measurement_type === "energy"
  );
  const hotWaterData = apartmentConsumption?.find(
    (item) => item.vala_description.measurement_type === "volume"
  );

  type View = "temperature" | "electricity" | "hotWater" | "monthlyStatistics";
  const views: { key: View; label: string }[] = [
    { key: "temperature", label: "Temperatur" },
    { key: "electricity", label: "Elförbrukning" },
    { key: "hotWater", label: "Varmvattenförbrukning" },
    { key: "monthlyStatistics", label: "Månadsstatistik" },
  ];

  return (
    <div className="">
      {/* Byggnads- och lägenhetsinformation */}
      <div className="flex flex-col w-full md:w-1/4 rounded-lg px-6 py-6 ">
        <h1 className="text-3xl font-extrabold text-white pb-2 border-b border-neonBlue">
          {building?.name ?? "Okänd byggnad"}
        </h1>
        <h3 className="text-lg font-semibold text-gray-300 mt-2 px-1 rounded-md shadow-md">
          Lägenhet: {apartment?.apt_id ?? "N/A"}
        </h3>
      </div>

      {/* Konsumtionskorten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 px-6 py-10 bg-gradient-to-r from-midNightBlue to-darkBg">
        <div className="p-6 bg-gradient-to-r from-midNightBlue to-darkBg text-neonBlue rounded-md flex flex-col justify-center items-center border border-neonBlue hover:shadow-neon transition-all">
          <div className="flex flex-col justify-center items-center">
            <h4 className="font-semibold text-lg text-neonBlue">
              Medeltemperatur
            </h4>
            <FaTemperatureHigh size={50} className="py-1 my-1 text-neonBlue" />
          </div>
          <p className="text-3xl font-bold text-white">
            {temperatureData ? temperatureData.average.toFixed(1) : "-"} °
            {temperatureData?.vala_description.unit || ""}
          </p>
        </div>
        <div className="p-6 bg-gradient-to-r from-midNightBlue to-darkBg text-neonBlue shadow-md rounded-md flex flex-col justify-center items-center border border-neonBlue hover:shadow-neon transition-all">
          <div className="flex flex-col justify-center items-center">
            <h4 className="font-semibold text-lg text-neonBlue">
              Elförbrukning
            </h4>
            <MdOutlineElectricalServices size={50} className="text-neonBlue" />
          </div>
          <p className="text-3xl font-bold text-white">
            {electricityData ? electricityData.difference.toFixed(1) : "-"}{" "}
            {electricityData?.vala_description.unit || ""}
          </p>
        </div>
        <div className="p-6 bg-gradient-to-r from-midNightBlue to-darkBg text-neonBlue shadow-md rounded-md flex flex-col justify-center items-center border border-neonBlue hover:shadow-neon transition-all">
          <div className="flex flex-col justify-center items-center">
            <h4 className="font-semibold text-lg text-neonBlue">
              Varmvattenförbrukning
            </h4>
            <FaHandHoldingWater size={50} className="pl-4 text-neonBlue" />
          </div>
          <p className="text-3xl font-bold text-white">
            {hotWaterData ? hotWaterData.difference.toFixed(0) : "-"}{" "}
            {hotWaterData?.vala_description.unit || ""}
          </p>
        </div>
      </div>

      {/* Visa fel eller laddning om det behövs */}
      {apartmentConsumptionLoading && (
        <div className="flex justify-center text-neonBlue">
          Laddar konsumtionsdata...
        </div>
      )}
      {apartmentConsumptionError && (
        <div className="bg-gray-900 text-white">
          Fel vid hämtning av konsumtionsdata: {apartmentConsumptionError}
        </div>
      )}

      {/* Diagram och Statistik */}
      <div className="bg-gradient-to-r from-midNightBlue to-darkBg">
        {/* Knappmeny för att välja visning */}
        <div className="flex justify-center space-x-4 my-6">
          {views.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveView(key)}
              className={`px-6 py-3 font-semibold rounded-md transition-all duration-300 shadow-sm 
        ${
          activeView === key
            ? "bg-neonBlue text-white shadow-neonBlue"
            : "bg-darkBgLight text-neonBlue hover:bg-neonBlue hover:text-white hover:shadow-neonBlue"
        }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Rendera endast den valda vyn */}
        <div className="flex flex-col items-center">
          {activeView === "temperature" && (
            <div className="w-[80%]  p-6 rounded-lg ">
              <h3 className="text-lg flex justify-center font-semibold text-white mb-4">
                Inomhustemperatur
              </h3>
              <TemperatureChart batchData={batchData} />
            </div>
          )}

          {activeView === "electricity" && (
            <div className="w-[80%] p-6 rounded-lg ">
              <h3 className="text-lg flex justify-center font-semibold text-white mb-4">
                Elförbrukning
              </h3>
              <ElectricityChart batchData={batchData} />
            </div>
          )}

          {activeView === "hotWater" && (
            <div className="w-[80%]  p-6 rounded-lg">
              <h3 className="text-lg flex justify-center font-semibold text-white mb-4">
                Varmvattenförbrukning
              </h3>
              <HotWaterChart batchData={batchData} />
            </div>
          )}

          {activeView === "monthlyStatistics" && (
            <div className="w-[80%] h-auto p-6 rounded-lg pb-10">
              <h3 className="text-xl font-semibold flex justify-center text-white mb-4">
                Månadsstatistik
              </h3>
              <MonthlyStatistics
                data={monthlyStatistics}
                loading={monthlyLoading}
                error={monthlyError}
              />
            </div>
          )}
        </div>
        {activeView !== "monthlyStatistics" && (
          <div className="flex justify-center space-x-4 my-6 pb-20 flex-col">
            <h3 className="text-white text-xl font-semibold justify-center items-center flex p-3">
              Välj tidsintervall
            </h3>
            <div className="flex justify-center items-center gap-3">
              {[1, 7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => setSelectedDays(days)}
                  className={`px-6 py-2 font-semibold rounded-md transition-all
            ${
              selectedDays === days
                ? "bg-neonBlue text-white shadow-neonBlue"
                : "bg-darkBgLight text-neonBlue hover:bg-neonBlue hover:text-white hover:shadow-neonBlue"
            }`}
                >
                  {days} dagar
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
