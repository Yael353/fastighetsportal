import React, { useEffect, useMemo, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
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

  const [batchData, setBatchData] = useState<BatchSensorDataResponse[] | null>(
    null
  );

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
    if (!buildings || Object.keys(buildings).length === 0) {
      dispatch(fetchBuildings({ id: sensorDomainId }));
    }
  }, [sensorDomainId, dispatch]);

  const buildingId = useMemo(() => {
    if (!buildings || Object.keys(buildings).length === 0) return null;
    return Object.values(buildings).find((building) =>
      building.apartments?.some((apartment) => apartment.apt_id === apartmentId)
    )?.building_id;
  }, [buildings, apartmentId]);

  useEffect(() => {
    if (sensorDomainId && buildingId && apartmentId) {
      dispatch(
        fetchMonthlyApartmentStatistics({
          sensorDomainId,
          buildingId,
          apartmentId,
          days_interval: 30,
        })
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

  // === Hämta sensorIds från apartmentConsumption och dispatcha fetchBatchSensorData ===
  const sensorIds = useMemo(
    () => apartmentConsumption?.map((item) => item.id) || [],
    [apartmentConsumption]
  );

  useEffect(() => {
    if (sensorDomainId) {
      dispatch(
        fetchBatchSensorData({
          sensorDomainId,
          sensorIds,
          startUtc: moment().utc().subtract(1, "days"),
          endUtc: moment().utc(),
          freq: BatchSensorDataFreq.raw,
        })
      )
        .unwrap()
        .then(setBatchData)
        .catch(console.error);
    }
  }, [sensorDomainId, sensorIds, dispatch]);

  if (buildingsLoading) {
    return <div>Laddar byggnader...</div>;
  }
  if (buildingsError) {
    return <div>Fel vid hämtning av byggnader: {buildingsError}</div>;
  }
  if (!buildingId) {
    return <div>Byggnad kunde inte hittas för lägenhet: {apartmentId}</div>;
  }

  const building = Object.values(buildings).find(
    (b) => b.building_id === buildingId
  );
  const apartment = building?.apartments.find((a) => a.apt_id === apartmentId);

  // Korten
  const temperatureData = apartmentConsumption?.find(
    (item) => item.vala_description.measurement_type === "temp"
  );
  const electricityData = apartmentConsumption?.find(
    (item) => item.vala_description.measurement_type === "energy"
  );
  const hotWaterData = apartmentConsumption?.find(
    (item) => item.vala_description.measurement_type === "volume"
  );

  return (
    <div className="bg-darkBg">
      {/* Byggnads- och lägenhetsinformation */}
      <div className="flex flex-col w-full md:w-1/4 rounded-lg px-6 py-6 shadow-lg">
        <h1 className="text-3xl font-extrabold text-white pb-2 border-b border-gray-600">
          {building?.name ?? "Okänd byggnad"}
        </h1>
        <h3 className="text-lg font-semibold text-gray-300 mt-4 bg-gray-700 p-3 rounded-md shadow-md">
          Lägenhet: {apartment?.apt_id ?? "N/A"}
        </h3>
      </div>

      {/* Konsumtionskorten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 px-6 py-10 bg-darkBg shadow-lg ">
        <div className="p-6 bg-darkBgLight text-neonBlue shadow-md rounded-md flex flex-col justify-center items-center border border-neonBlue hover:shadow-neon transition-all">
          <div className="flex flex-col justify-center items-center">
            <h4 className="font-semibold text-lg ">Medeltemperatur</h4>
            <FaTemperatureHigh size={50} className="pl-4" />
          </div>
          <p className="text-3xl font-bold text-white">
            {temperatureData ? temperatureData.average.toFixed(1) : "-"}{" "}
            {temperatureData?.vala_description.unit || ""}
          </p>
        </div>
        <div className="p-6 bg-darkBgLight text-neonBlue shadow-md rounded-md flex flex-col justify-center items-center border border-neonBlue hover:shadow-neon transition-all">
          <div className="flex flex-col justify-center items-center">
            <h4 className="font-semibold text-lg pr-4">Elförbrukning</h4>
            <MdOutlineElectricalServices size={50} />
          </div>
          <p className="text-3xl font-bold text-white">
            {electricityData ? electricityData.difference.toFixed(1) : "-"}{" "}
            {electricityData?.vala_description.unit || ""}
          </p>
        </div>
        <div className="p-6 bg-darkBgLight text-neonBlue shadow-md rounded-md flex flex-col justify-center items-center border border-neonBlue hover:shadow-neon transition-all">
          <div className="flex flex-col justify-center items-center">
            <h4 className="font-semibold text-lg ">Varmvattenförbrukning</h4>
            <FaHandHoldingWater size={50} className="pl-4" />
          </div>
          <p className="text-3xl font-bold text-white">
            {hotWaterData ? hotWaterData.difference.toFixed(0) : "-"}{" "}
            {hotWaterData?.vala_description.unit || ""}
          </p>
        </div>
      </div>

      {/* Visa fel eller laddning om det behövs */}
      {apartmentConsumptionLoading && (
        <div className="bg-gray-900 text-white">Laddar konsumtionsdata...</div>
      )}
      {apartmentConsumptionError && (
        <div className="bg-gray-900 text-white">
          Fel vid hämtning av konsumtionsdata: {apartmentConsumptionError}
        </div>
      )}

      {/* Diagram och Statistik */}
      <div className="flex flex-col justify-center items-center gap-8 px-6 py-6">
        {/* Temperatur - vänster */}
        <div className="w-[80%]  bg-gray-800 p-6 rounded-lg shadow-md flex flex-col">
          <div className="flex justify-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Inomhustemperatur
            </h3>
          </div>
          <div className="flex-grow h-[400px]">
            <TemperatureChart batchData={batchData} />
          </div>
        </div>

        {/* Elförbrukning - höger */}
        <div className="w-[80%] bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Elförbrukning
            </h3>
          </div>
          <ElectricityChart batchData={batchData} />
        </div>

        {/* Varmvatten - vänster */}

        <div className="w-[80%] bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Varmvattenförbrukning
            </h3>
          </div>
          <HotWaterChart batchData={batchData} />
        </div>

        {/* Månadsstatistiken - tar hela bredden och kräver scroll */}

        <div className="border-t border-neonBlue w-full shadow-md">
          <h3 className="flex justify-center text-xl pt-5 font-semibold text-white mb-4">
            Månadsstatistik
          </h3>
          <div className="w-full h-[400px] overflow-y-auto bg-gray-900 p-6 rounded-lg shadow-md">
            <MonthlyStatistics
              data={monthlyStatistics}
              loading={monthlyLoading}
              error={monthlyError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <Tabs defaultValue="charts" className="space-y-4">
  <TabsList>
    <TabsTrigger value="charts">Grafer</TabsTrigger>
    <TabsTrigger value="monthlyStatistics">Tabell</TabsTrigger>
  </TabsList> */
}
{
  /* <TabsContent value="charts" className="space-y-4"> */
}
{
  /* </TabsContent> */
}

{
  /* <TabsContent value="monthlyStatistics"> */
}
{
  /* </TabsContent> */
}
{
  /* </Tabs> */
}
