import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
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

  const { id } = useParams();
  const sensorDomainId = Array.isArray(id) ? id[0] : id;

  // Hämta lägenhetsstatistik från Redux
  const summaryStatistics = useSelector(
    (state: RootState) => state.summaryStatistics.data
  );
  const summaryLoading = useSelector(
    (state: RootState) => state.summaryStatistics.loading
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sensorDomainId) {
      dispatch(fetchSummaryApartmentStatistics({ sensorDomainId }))
        .catch((error) =>
          console.error("Fel vid hämtning av summaryStatistics:", error)
        )
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [sensorDomainId, dispatch]);

  if (summaryLoading || isLoading) {
    return <div>Laddar...</div>;
  }

  // Här renderar vi inget om summaryStatistics är null eller tomt
  if (!summaryStatistics || Object.keys(summaryStatistics).length === 0) {
    return null; 
  }

  return (
    <div className="rounded-lg bg-darkBg border border-neonBlue">
      <div className="bg-darkBg rounded-lg max-w-full mx-auto h-auto">
        <h2 className="text-lg font-bold text-neonBlue mb-4 p-4 flex justify-center">
          Medelvärde för lägenheter de 30 senaste dagarna
        </h2>
        <Table className="border border-twilight text-sm">
          <TableHeader className="bg-darkBgLight text-neonBlue">
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
            {Object.entries(summaryStatistics).map(([size, stats]) => (
              <TableRow
                key={size}
                className="bg-darkBgLight text-white hover:bg-transparent"
              >
                <TableCell className="text-neonBlue">{size}</TableCell>
                {["kWh", "L", "C"].map((unit) => (
                  <TableCell
                    key={unit}
                    className="text-center font-semibold text-gray-300"
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
