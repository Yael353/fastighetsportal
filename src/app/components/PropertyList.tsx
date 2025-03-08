"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getList } from "@/features/slices/overviewSlice";
import { RootState, AppDispatch } from "@/features/store/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SensorDomain } from "@/features/models/sensor-data";
import { getAuthToken } from "@/utils/auth";
import { getSensorDomainSensorDescription } from "@/utils/sensors";

export function PropertyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const sensorDomainsPerPage = 9;
  const dispatch = useDispatch<AppDispatch>();

  const { sensorDomains, loading, error } = useSelector(
    (state: RootState) => state.overview
  );

  const authToken = getAuthToken();

  useEffect(() => {
    if (authToken) {
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

  const sensorDomainsArray = useMemo(() => {
    return Array.isArray(sensorDomains?.data) ? sensorDomains.data : [];
  }, [sensorDomains]);

  const totalPages = sensorDomains?.total
    ? Math.ceil(sensorDomains.total / sensorDomainsPerPage)
    : 1;

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo(0, 0);
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Skapa en array med sidnummer
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Max antal sidnummer som visas samtidigt
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Justera startPage om vi närmar oss slutet
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const currentSensorDomains = sensorDomains?.data || [];

  if (loading) {
    return (
      <div className="w-full bg-gray-900 pt-10 text-center text-white">
        Laddar...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full pt-10 text-center text-white">Fel: {error}</div>
    );
  }

  if (currentSensorDomains.length === 0) {
    return (
      <div className="w-full flex flex-col pt-10 text-center text-white border-t">
        Inga sensor-domäner tillgängliga
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-center items-center bg-darkBg py-10">
      <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentSensorDomains.map((domain: SensorDomain, index: number) => {
          const { ucSensors, apartments } =
            getSensorDomainSensorDescription(domain);

          return (
            <div
              key={domain.id}
              className="relative p-6 rounded-lg border border-neonBlue shadow-lg shadow-neonBlue/50 text-white hover:scale-105 transition-transform duration-200 bg-darkBg/80 bg-no-repeat bg-center bg-[length:110%]"
              style={{ backgroundImage: "url('/images/bgcard.jpg')" }}
            >
              <Link href={`/dashboard/detailedPage/${domain.id}`}>
                <div className="absolute top-4 left-5 w-12 h-12 flex items-center justify-center bg-neonBlue text-darkBg text-xl font-extrabold rounded-md">
                  {domain.name.charAt(0).toUpperCase()}
                </div>

                <span
                  className={`px-3 py-1 text-xs flex float-end font-semibold uppercase rounded-md ${
                    domain.harvester.active
                      ? "bg-neonGreen text-darkBg"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {domain.harvester.active ? "Active" : "Inactive"}
                </span>

                <div className="flex flex-col items-start mt-16">
                  <h2 className="text-xl font-bold text-neonBlue first-letter:uppercase">
                    {domain.name}
                  </h2>

                  <div className="mt-4 flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-300">
                      Uc Sensorer:
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {ucSensors}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-300">
                      Lägenheter:
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {apartments}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="w-full px-4 flex justify-between items-center pt-10 text-white">
        <Button
          className="bg-darkBg border border-neonBlue"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Föregående
        </Button>

        <div className="flex gap-2">
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              className={`border border-neonBlue ${
                currentPage === page
                  ? "bg-neonBlue text-darkBg"
                  : "bg-darkBg text-white"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          className="bg-darkBg border border-neonBlue"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Nästa <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

}
