import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
import { getAuthToken } from "@/utils/auth";
import { fetchAlgoConfig } from "@/features/thunks/algoConfig";
import { fetchSummaryApartmentStatistics } from "@/features/thunks/fetchSensors";
import { useParams } from "next/navigation"; // Importera useParams
import ApartmentsCards from "./ApartmentsCards";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ApartmentComp() {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = getAuthToken();
  const { id: sensorDomainId } = useParams(); // Hämta sensorDomainId från URL:en

  // Hämta controllers från property-store
  const property = useSelector((state: RootState) => state.property.data);
  const controllers = property?.controllers || [];

  // Hämta algoConfig (vi visar bara iat_sp från denna)
  const algoConfig = useSelector((state: RootState) => state.algoConfig.data);
  const algoLoading = useSelector(
    (state: RootState) => state.algoConfig.loading
  );

  // Hämta lägenhetsstatistik från summaryStatistics
  const summaryStatistics = useSelector(
    (state: RootState) => state.summaryStatistics.data
  );
  const summaryLoading = useSelector(
    (state: RootState) => state.summaryStatistics.loading
  );

  const [isLoading, setIsLoading] = useState(true);

  // Hämta AlgoConfig & Lägenhetsstatistik vid komponentens mount
  useEffect(() => {
    if (authToken && controllers.length > 0) {
      controllers.forEach((controller) => {
        dispatch(fetchAlgoConfig({ controllerId: controller.id })).catch(
          (error) =>
            console.error(
              `Fel vid hämtning av algoConfig för ${controller.id}:`,
              error
            )
        );
      });
    }

    if (sensorDomainId) {
      dispatch(fetchSummaryApartmentStatistics({ sensorDomainId }))
        .catch((error) =>
          console.error("Fel vid hämtning av summaryStatistics:", error)
        )
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [authToken, JSON.stringify(controllers), sensorDomainId, dispatch]);

  if (isLoading || algoLoading || summaryLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="rounded-lg p-2">
      <div className=" bg-gray-900 shadow-md rounded-lg max-w-full mx-auto h-auto ">
        <h2 className="text-lg font-bold text-white mb-4">
          Medelvärde för lägenheter de 30 senaste dagarna
        </h2>
        <Table className="border border-gray-700 text-sm">
          <TableHeader className="bg-gray-800 text-gray-200">
            <TableRow>
              <TableHead className="text-left font-extrabold">
                Antal rum
              </TableHead>
              <TableHead className="text-center font-extrabold">kWh</TableHead>
              <TableHead className="text-center font-extrabold">L</TableHead>
              <TableHead className="text-center font-extrabold">°C</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryStatistics &&
              Object.entries(summaryStatistics).map(([size, stats]) => (
                <TableRow
                  key={size}
                  className="hover:bg-gray-400 bg-gray-700 text-white hover:transition-transform duration-150 hover:scale-103"
                >
                  <TableCell>{size}</TableCell>
                  {["kWh", "L", "C"].map((unit) => (
                    <TableCell key={unit} className="text-center">
                      {stats
                        .find((stat) => stat.u_name === unit)
                        ?.avg?.toFixed(1) || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="pt-8">
        <ApartmentsCards />
      </div>
    </div>
  );
}
