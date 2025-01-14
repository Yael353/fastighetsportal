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
      <div className="w-[95%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSensorDomains.map((domain: SensorDomain) => {
          const { ucSensors, apartments } =
            getSensorDomainSensorDescription(domain);

          return (
            <div
              key={domain.id}
              className="p-4 border rounded-lg shadow-md bg-white hover:scale-105 hover:shadow-lg transition-transform duration-200 hover:bg-blue-100"
            >
              {/* status badge */}
              <span
                className={` top-0 right-0 transform translate-x-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold uppercase rounded-full ${
                  domain.harvester.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {domain.harvester.active ? "Active" : "Inactive"}
              </span>

              <Link href={`/dashboard/detailedPage/${domain.id}`}>
                <div className="flex items-center p-4 space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white text-xl font-extrabold rounded-full">
                    {domain.name.charAt(0).toLocaleUpperCase()}
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 tracking-wide first-letter:uppercase">
                    {domain.name}
                  </h2>
                </div>

                {/* Detaljer om sensorer och lägenheter */}
                <div className="flex justify-between text-sm text-gray-700 space-x-4 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-indigo-600">
                      Uc Sensorer
                    </span>
                    <span className="text-lg font-semibold">{ucSensors}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Lägenheter
                    </span>
                    <span className="text-lg font-semibold">{apartments}</span>
                  </div>
                </div>

                {/* Diagram */}
                {/* <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-indigo-500 mb-2">
                    Temperatur inomhus:
                  </p>
                  <div className="h-35 w-[50%] flex items-center justify-center rounded-lg ">
                    <ChartTest />
                  </div>
                </div> */}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-between items-center mt-6">
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
