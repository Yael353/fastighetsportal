import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
import { getAuthToken } from "@/utils/auth";
import { fetchAlgoConfig } from "@/features/thunks/algoConfig";
import { fetchSummaryApartmentStatistics } from "@/features/thunks/fetchSensors";
import { useParams } from "next/navigation";
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
  const { id } = useParams();
  const sensorDomainId = Array.isArray(id) ? id[0] : id;

  // Hämta controllers från property-store
  const property = useSelector((state: RootState) => state.property.data);
  const controllers = property?.controllers || [];

  console.log("cont", controllers);

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
  const [selectedControllerId, setSelectedControllerId] = useState<
    string | null
  >(null);

  // Hämta AlgoConfig & Lägenhetsstatistik vid komponentens mount
  useEffect(() => {
    if (authToken && selectedControllerId) {
      // Fetch algoConfig only for the selected controller ID
      if (!algoConfig?.[selectedControllerId]) {
        const fetchAlgo = async () => {
          const data = await dispatch(
            fetchAlgoConfig({ controllerId: selectedControllerId })
          );
          if (data) {
            console.log(`Hämtade algoConfig för ${selectedControllerId}`);
          } else {
            console.warn(
              `Ingen algoConfig hittades för ${selectedControllerId}`
            );
          }
        };
        fetchAlgo();
      }
    }
  }, [authToken, selectedControllerId, Object.keys(algoConfig || {}).length]);

  useEffect(() => {
    if (sensorDomainId) {
      dispatch(fetchSummaryApartmentStatistics({ sensorDomainId }))
        .then((data) => {
          if (!data) {
            console.warn(
              `Ingen summaryStatistics hittades för ${sensorDomainId}`
            );
          }
        })
        .catch((error) =>
          console.error("Fel vid hämtning av summaryStatistics:", error)
        )
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [sensorDomainId]);

  console.log("Summarystat ", summaryStatistics);

  if (summaryLoading) {
    return <div>Laddar...</div>;
  }

  if (summaryStatistics == null) {
    return (
      <div className="flex justify-center text-lg font-bold bg-gray-900 text-white mb-4">
        Medelvärde för detta objekt saknas
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-darkBg border border-x-neonBlue">
      <div className="bg-darkBg rounded-lg max-w-full mx-auto h-auto">
        <h2 className="text-lg font-bold text-neonBlue mb-4 p-4">
          Medelvärde för lägenheter de 30 senaste dagarna
        </h2>
        <Table className="border border-twilight text-sm">
          <TableHeader className="bg-midnight text-neonBlue">
            <TableRow>
              <TableHead className="text-left font-extrabold">
                Antal rum
              </TableHead>
              <TableHead className="text-center font-extrabold text-xl">
                kWh
              </TableHead>
              <TableHead className="text-center font-extrabold text-xl">
                L
              </TableHead>
              <TableHead className="text-center font-extrabold text-xl">
                °C
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryStatistics &&
              Object.entries(summaryStatistics).map(([size, stats]) => (
                <TableRow key={size} className="bg-softNavy text-white">
                  <TableCell className="text-neonBlue ">{size}</TableCell>
                  {["kWh", "L", "C"].map((unit) => (
                    <TableCell
                      key={unit}
                      className="text-center font-extrabold text-white"
                    >
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
    </div>
  );
}
