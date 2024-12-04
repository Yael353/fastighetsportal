"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSensorDomains } from "@/features/slices/overviewSlice";
import { RootState, AppDispatch } from "@/features/store/store"; // Importera AppDispatch
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PropertyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const sensorDomainsPerPage = 10;
  const dispatch = useDispatch<AppDispatch>(); // Typa dispatch med AppDispatch

  const token = useSelector((state: RootState) => state.auth.token);
  console.log("Token from Redux store:", token);

  // Hämta sensor-domäner från Redux store
  const { sensorDomains, loading, error } = useSelector(
    (state: RootState) => state.overview
  );

  console.log("sensorDomains från store:", sensorDomains); // Logga sensorDomains från store

  useEffect(() => {
    // Ladda sensor-domäner vid komponentens uppstart
    if (!sensorDomains) {
      console.log("Dispatchar fetchSensorDomains...");
      dispatch(
        fetchSensorDomains({
          offset: (currentPage - 1) * sensorDomainsPerPage,
          limit: sensorDomainsPerPage,
        })
      );
    }
  }, [currentPage, dispatch, sensorDomains]);

  const indexOfLastDomain = currentPage * sensorDomainsPerPage;
  const indexOfFirstDomain = indexOfLastDomain - sensorDomainsPerPage;

  // Kontrollera om sensorDomains är en array innan slice
  const currentSensorDomains = Array.isArray(sensorDomains)
    ? sensorDomains.slice(indexOfFirstDomain, indexOfLastDomain)
    : []; // Om det inte är en array, returnera en tom array

  console.log("currentSensorDomains:", currentSensorDomains); // Logga aktuella sensor-domäner

  const totalPages = sensorDomains
    ? Math.ceil(sensorDomains.length / sensorDomainsPerPage)
    : 1;

  console.log("totalPages:", totalPages); // Logga totalt antal sidor

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return <div>Laddar...</div>;
  }

  if (error) {
    console.error("Error:", error); // Logga fel om det finns något
    return <div>Fel: {error}</div>;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableCaption>En lista över sensor-domäner</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Namn</TableHead>
              <TableHead className="w-1/4">Plats</TableHead>
              <TableHead className="w-1/4">Information</TableHead>
              <TableHead className="w-1/4">Antal Sensorn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSensorDomains.length > 0 ? (
              currentSensorDomains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>{`${domain.location.latitude}, ${domain.location.longitude}`}</TableCell>
                  <TableCell>{domain.info}</TableCell>
                  <TableCell>{domain.sensors.length}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Inga sensor-domäner tillgängliga
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="w-full flex justify-between items-center p-4 border-t">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Föregående
        </Button>
        <span>
          Sida {currentPage} av {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Nästa <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
