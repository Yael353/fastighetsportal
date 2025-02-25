import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import moment from "moment";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";

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

import SingleApartmentChart from "./TemperatureChart";
import MonthlyStatistics from "./MonthlyStatistics";
import ElectricityChart from "./ElectricityChart";
import HotWaterChart from "./HotWaterChart";
import TemperatureChart from "./TemperatureChart";

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
  console.log("buildings från useSelector direkt", buildings);

  const monthlyStatistics = useSelector(
    (state: RootState) => state.monthlyStatistics.data
  );
  const monthlyLoading = useSelector(
    (state: RootState) => state.monthlyStatistics.loading
  );
  const monthlyError = useSelector(
    (state: RootState) => state.monthlyStatistics.error
  );

  console.log("MonthlyStatistics!", monthlyStatistics);

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
          startUtc: moment().utc().subtract(1, "day"),
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
    (item) => item.vala_description.name === "IIAT"
  );
  const electricityData = apartmentConsumption?.find(
    (item) => item.vala_description.name === "IEM"
  );
  const hotWaterData = apartmentConsumption?.find(
    (item) => item.vala_description.name === "IHTWM"
  );

  return (
    <div className="bg-gray-900">
      {/* Byggnads- och lägenhetsinformation */}
      <div className="flex flex-col w-[25%] rounded-lg px-4 pb-10">
        <h1 className="text-3xl font-extrabold text-white   pt-2">
          {building?.name ?? "Okänd byggnad"}
        </h1>
        <h3 className="text-lg font-semibold  p-2 text-gray-300  shadow-sm rounded-b-lg">
          Lägenhet: {apartment?.apt_id ?? "N/A"}
        </h3>
      </div>

      {/* Konsumtionskorten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 px-4 bg-gray-900 py-10">
        <div className="p-4 bg-gray-700 text-gray-300 shadow rounded-md flex flex-col justify-center items-center">
          <h4 className="font-semibold">Medeltemperatur</h4>
          <p className="text-2xl">
            {temperatureData ? temperatureData.average.toFixed(2) : "-"}{" "}
            {temperatureData?.vala_description.unit || ""}
          </p>
        </div>
        <div className="p-4 bg-gray-700 text-gray-300 shadow rounded-md flex flex-col justify-center items-center">
          <h4 className="font-semibold">Elförbrukning</h4>
          <p className="text-2xl">
            {electricityData ? electricityData.difference.toFixed(2) : "-"}{" "}
            {electricityData?.vala_description.unit || ""}
          </p>
        </div>
        <div className="p-4 bg-gray-700 text-gray-300 shadow rounded-md flex flex-col justify-center items-center">
          <h4 className="font-semibold">Varmvattenförbrukning</h4>
          <p className="text-2xl">
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

      {/* Diagram och Statistik - Grid Layout */}
      <div className="grid grid-cols-2 px-4 grid-rows-2 gap-6 h-[900px]">
        {/* Indoor Air temp */}
        <div className="rounded-lg flex flex-col w-full h-full">
          <h3 className="text-lg text-white font-semibold mb-2">
            Inomhustemperatur
          </h3>
          <div className="rounded-md flex flex-col flex-1">
            <TemperatureChart batchData={batchData} />
          </div>
        </div>

        {/* Monthly Statistics */}
        <div className="rounded-lg flex flex-col w-full h-full">
          <h3 className="text-lg text-white font-semibold mb-2">
            Månadsvisa Medelvärden
          </h3>
          <div className="flex-1 rounded-md overflow-auto min-h-0">
            <MonthlyStatistics
              data={monthlyStatistics}
              loading={monthlyLoading}
              error={monthlyError}
            />
          </div>
        </div>

        {/* Electricity Consumption */}
        <div className="rounded-lg flex flex-col w-full h-full py-5">
          <h3 className="text-lg text-white font-semibold mb-2">
            Elförbrukning
          </h3>
          <div className="rounded-md flex flex-col flex-1">
            <ElectricityChart batchData={batchData} />
          </div>
        </div>

        {/* Hot Water Consumption */}
        <div className="rounded-lg flex flex-col w-full h-full py-5">
          <h3 className="text-lg text-white font-semibold mb-2">
            Varmvattenförbrukning
          </h3>
          <div className="rounded-md flex flex-col flex-1">
            <HotWaterChart batchData={batchData} />
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
