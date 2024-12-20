"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getList } from "@/features/slices/overviewSlice";
import { RootState, AppDispatch } from "@/features/store/store";
import Link from "next/link";
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
import { getSensorDomainSensorDescription } from "@/utils/sensors";
import { ChartTest } from "@/components/ui/ChartTest";

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
    window.scrollTo(0, 0);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
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
    <div className="w-full flex flex-col space-y-6 justify-center items-center">
      <div className="w-[95%] ">
        {currentSensorDomains.map((domain: SensorDomain) => {
          const { ucSensors, apartments } =
            getSensorDomainSensorDescription(domain);

          return (
            <div
              key={domain.id}
              className="p-6 border rounded-lg shadow-sm my-4 bg-white flex flex-col space-y-6 hover:scale-105 hover:m-4 hover:bg-blue-100"
            >
              <Link href={`/dashboard/detailedPage/${domain.id}`}>
                {/* Namn som rubrik */}
                <h2 className="text-2xl font-extrabold text-gray-900 text-center tracking-wide first-letter:uppercase">
                  {domain.name}
                </h2>

                {/* Detaljer om sensorer och lägenheter */}
                <div className="flex justify-around text-base text-gray-700 space-x-6">
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-lg font-bold text-indigo-800">
                      Uc Sensorer
                    </span>
                    <span className="text-xl font-semibold text-black">
                      {ucSensors}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Lägenheter
                    </span>
                    <span className="text-xl font-semibold text-black">
                      {apartments}
                    </span>
                  </div>
                </div>

                {/* Tom yta för framtida diagram */}
                <div className="flex flex-col justify-center items-center">
                  <p className="font-semibold pb-2 text-xl text-[#8884d8]">
                    Temperatur:
                  </p>
                  <div className="h-24  max-w-[658px] mx-auto flex items-center justify-center rounded-xl">
                    <ChartTest />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-between items-center ">
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
