"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getList } from "@/features/slices/overviewSlice";
import { RootState, AppDispatch } from "@/features/store/store";
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
import { SensorDomain } from "@/features/models/sensor-data";
import { getAuthToken } from "@/utils/auth";

export function PropertyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const sensorDomainsPerPage = 10;
  const dispatch = useDispatch<AppDispatch>();

  const { sensorDomains, loading, error } = useSelector(
    (state: RootState) => state.overview
  );

  console.log("sensorDomains", sensorDomains);

  // Hämta autentiseringstoken från localStorage
  const authToken = getAuthToken();

  useEffect(() => {
    if (authToken) {
      // Om token finns, hämta sensor-domäner
      dispatch(
        getList({
          offset: (currentPage - 1) * sensorDomainsPerPage,
          limit: sensorDomainsPerPage,
        })
      );
    } else {
      console.error("Ingen giltig autentisering tillgänglig.");
    }
  }, [currentPage, dispatch, authToken]);

  // Hämta sensor-domäner från sensorDomains.data
  const sensorDomainsArray = Array.isArray(sensorDomains?.data)
    ? sensorDomains.data
    : [];
  console.log("sensorDomainsArray ", sensorDomainsArray);

  const totalPages = sensorDomainsArray.length
    ? Math.ceil(sensorDomainsArray.length / sensorDomainsPerPage)
    : 1;

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Dela upp sensorDomainsArray baserat på sidnummer
  const currentSensorDomains = sensorDomainsArray.slice(
    (currentPage - 1) * sensorDomainsPerPage,
    currentPage * sensorDomainsPerPage
  );

  console.log("currentsensorDomains: ", currentSensorDomains);

  // Rendera när datan laddas
  if (loading) {
    return <div>Laddar...</div>;
  }

  if (error) {
    return <div>Fel: {error}</div>;
  }

  // Rendera tom lista om inga sensor-domäner finns
  if (currentSensorDomains.length === 0) {
    return (
      <div className="w-full flex flex-col">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableCaption>En lista över sensor-domäner</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Namn</TableHead>
                <TableHead>Harvester Aktiv</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  Inga sensor-domäner tillgängliga
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto">
        <Table>
          <TableCaption>En lista över sensor-domäner</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Namn</TableHead>
              <TableHead>Harvester Aktiv</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSensorDomains.map((domain: SensorDomain) => (
              <TableRow key={domain.id}>
                <TableCell>{domain.name}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block w-4 h-4 rounded-full justify-center ml-10 ${
                      domain.harvester.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                </TableCell>
              </TableRow>
            ))}
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
