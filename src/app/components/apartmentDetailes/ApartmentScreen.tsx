import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { AppDispatch, RootState } from "@/features/store/store";
import {
  fetchApartmentConsumptionLastXDays,
  fetchBuildings,
  fetchMonthlyApartmentStatistics,
} from "@/features/thunks/fetchSensors";
import SingleApartmentChart from "./SingleApartmentChart";
import MonthlyStatistics from "./MonthlyStatistics";

export default function ApartmentScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { id: sensorDomainId, apartmentId } = useParams();

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

  // Observera: vi hämtar här ut arrayen från vårt responsobjekt
  const apartmentConsumption = useSelector(
    (state: RootState) => state.apartmentConsumption.data?.data
  );
  const apartmentConsumptionLoading = useSelector(
    (state: RootState) => state.apartmentConsumption.loading
  );
  const apartmentConsumptionError = useSelector(
    (state: RootState) => state.apartmentConsumption.error
  );

  console.log(
    "ApartmentConsumption från apartmentScreen",
    apartmentConsumption
  );

  useEffect(() => {
    if (sensorDomainId) {
      dispatch(fetchBuildings({ id: sensorDomainId }));
    }
  }, [sensorDomainId, dispatch]);

  const buildingId = Object.values(buildings).find((building) =>
    building.apartments?.some((apartment) => apartment.apt_id === apartmentId)
  )?.building_id;

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

  // Extrahera värden från apartmentConsumption-arrayen
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
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-extrabold bg-blue-100 p-4 rounded-xl shadow-md">
          {building?.name ?? "Okänd byggnad"}
        </h1>
        <h3 className="text-lg font-semibold mt-1 p-2 bg-blue-50 rounded-lg shadow-sm">
          Lägenhet: {apartment?.apt_id ?? "N/A"}
        </h3>
      </div>

      {/* Konsumtionskorten */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        {/* Medeltemperatur */}
        <div className="p-4 bg-white shadow rounded">
          <h4 className="font-semibold">Medeltemperatur</h4>
          <p className="text-2xl">
            {temperatureData ? temperatureData.average.toFixed(2) : "-"}{" "}
            {temperatureData?.vala_description.unit || ""}
          </p>
        </div>

        {/* Elförbrukning */}
        <div className="p-4 bg-white shadow rounded">
          <h4 className="font-semibold">Elförbrukning</h4>
          <p className="text-2xl">
            {electricityData ? electricityData.difference : "-"}{" "}
            {electricityData?.vala_description.unit || ""}
          </p>
        </div>

        {/* Varmvattenförbrukning */}
        <div className="p-4 bg-white shadow rounded">
          <h4 className="font-semibold">Varmvattenförbrukning</h4>
          <p className="text-2xl">
            {hotWaterData ? hotWaterData.difference : "-"}{" "}
            {hotWaterData?.vala_description.unit || ""}
          </p>
        </div>
      </div>

      {/* Visa fel eller laddning om det behövs */}
      {apartmentConsumptionLoading && <div>Laddar konsumtionsdata...</div>}
      {apartmentConsumptionError && (
        <div>
          Fel vid hämtning av konsumtionsdata: {apartmentConsumptionError}
        </div>
      )}

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Grafer</TabsTrigger>
          <TabsTrigger value="monthlyStatistics">Tabell</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <SingleApartmentChart
            data={apartmentConsumption}
            loading={apartmentConsumptionLoading}
            error={apartmentConsumptionError}
          />
        </TabsContent>

        <TabsContent value="monthlyStatistics">
          <MonthlyStatistics
            data={monthlyStatistics}
            loading={monthlyLoading}
            error={monthlyError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
