// components/ApartmentScreen.tsx
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthlyStatistics from "./MonthlyStatistics";
import { RootState, AppDispatch } from "@/features/store/store";
import { fetchBuildings } from "@/features/thunks/fetchSensors";

export default function ApartmentScreen() {
  // Använd useParams för att hämta parametrar från URL:en.
  // Exempelvis om din route ser ut så här:
  // /sensorDomains/[sensorDomainId]/apartments/[apartmentId]
  const { sensorDomainId, apartmentId, id } = useParams() as {
    sensorDomainId: string;
    apartmentId: string;
    id: string; // Om du har ett separat id för building, annars använder vi detta för att hämta building-data
  };

  const dispatch = useDispatch<AppDispatch>();

  // Hämta byggnadsdata från din Redux-slice för buildings.
  const {
    data: buildingData,
    loading: buildingLoading,
    error: buildingError,
  } = useSelector((state: RootState) => state.buildings);

  useEffect(() => {
    // Om vi har ett id (t.ex. buildingId) från URL eller om det är det värde vi vill använda för att hämta building-data.
    if (typeof id === "string") {
      dispatch(fetchBuildings({ id }));
    }
  }, [id, dispatch]);

  // När buildingData är hämtat, anta att buildingData innehåller ett fält "id" som är ditt buildingId.
  // Om buildingData inte finns ännu kan du använda ett fallback-värde eller visa en loading-indikator.
  const buildingId = buildingData?.data || "fallbackBuildingId";

  return (
    <div>
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Grafer</TabsTrigger>
          <TabsTrigger value="monthlystatistics">Tabell</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="container mx-auto">
            {/* Här kan du lägga in dina grafer eller andra diagramkomponenter */}
            <p>Grafer visas här.</p>
          </div>
        </TabsContent>

        <TabsContent value="monthlystatistics">
          <MonthlyStatistics
            sensorDomainId={sensorDomainId}
            buildingId={buildingId}
            apartmentId={apartmentId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
