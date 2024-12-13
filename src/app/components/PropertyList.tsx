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
import { AuthContentData } from "@/features/models/auth";

interface PropertyListProps {
  auth: AuthContentData;
}

export function PropertyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const sensorDomainsPerPage = 10;
  const dispatch = useDispatch<AppDispatch>();

  const { sensorDomains, loading, error } = useSelector(
    (state: RootState) => state.overview
  );

  // Hämta sensor-domäner vid sidladdning eller sidbyte
  // useEffect(() => {
  //   if (!sensorDomains) {
  //     // Kontrollera att auth är tillgänglig och har giltiga data
  //     if (!auth || !auth.jwtData || !auth.jwtData.accessToken) {
  //       console.error("Ingen giltig autentisering tillgänglig.");
  //       return;
  //     }

  //     dispatch(
  //       getList({
  //         offset: (currentPage - 1) * sensorDomainsPerPage,
  //         limit: sensorDomainsPerPage,
  //         auth,
  //       })
  //     );
  //   }
  // }, [currentPage, dispatch, sensorDomains, auth]);

  // Kontrollera att sensorDomains alltid är en array
  const sensorDomainsArray = Array.isArray(sensorDomains) ? sensorDomains : [];

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
                <TableHead>Plats</TableHead>
                <TableHead>Antal sensorer</TableHead>
                <TableHead>Harvester ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center">
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
              <TableHead>Plats</TableHead>
              <TableHead>Antal sensorer</TableHead>
              <TableHead>Harvester ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSensorDomains.map((domain: SensorDomain) => (
              <TableRow key={domain.id}>
                <TableCell>{domain.name}</TableCell>
                <TableCell>
                  {domain.location.latitude}, {domain.location.longitude}
                </TableCell>
                <TableCell>{domain.sensors.length}</TableCell>
                <TableCell>{domain.harvester?.id || "Ingen"}</TableCell>
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
