"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { RootState } from "@/features/store/store";
import { fetchBuildings } from "@/features/thunks/fetchSensors";
import {
  ApartmentResponse,
  BuildingResponse,
  BuildingsResponse,
} from "@/features/models/sensor-data";
import Link from "next/link";

export default function ApartmentsCards() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    data: buildingsData,
    loading,
    error,
  } = useSelector((state: RootState) => state.buildings);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const apartmentsPerPage = 9;

  useEffect(() => {
    dispatch(fetchBuildings({ id }));
  }, [id, dispatch]);

  if (loading) {
    return <div className="bg-gray-900 text-white">Laddar...</div>;
  }

  if (error) {
    return <div className="bg-gray-900 text-white">Fel: {error}</div>;
  }

  if (!buildingsData) {
    return (
      <div className="bg-gray-900 text-white">
        Ingen byggnadsdata tillgänglig.
      </div>
    );
  }

  // Extrahera alla lägenheter från buildingsData
  const apartments: ApartmentResponse[] = Object.values(
    buildingsData as BuildingsResponse
  ).flatMap((building: BuildingResponse) => building.apartments);

  // Filtrera på lägenhetsnr (apt_id) utifrån sökfrågan
  const filteredApartments = apartments.filter((apartment) =>
    apartment.apt_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);
  const startIndex = (currentPage - 1) * apartmentsPerPage;
  const currentApartments = filteredApartments.slice(
    startIndex,
    startIndex + apartmentsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6 py-10 bg-darkBg rounded-lg">
      {/* Sökfält */}
      <div className="flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Sök efter lägenhetsnummer..."
          className="pl-3 py-2 border border-neonBlue bg-midnight text-white placeholder-gray-400 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-neonBlue"
        />
      </div>

      {/* Lägenhetskort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
        {currentApartments.length > 0 ? (
          currentApartments.map((apartment: ApartmentResponse) => (
            <div
              key={apartment.apt_id}
              className="border border-neonBlue bg-softNavy p-4 rounded-lg shadow-md shadow-neonBlue/50 transition-transform transform hover:scale-105"
            >
              <Link
                href={`/dashboard/detailedPage/${id}/singleApartment/${apartment.apt_id}`}
                className="block h-full w-full text-center"
              >
                <h2 className="text-2xl font-bold mb-2 text-neonBlue">
                  Lgh: {apartment.apt_id}
                </h2>
                <p className="text-gray-300">
                  {apartment.size_type} - {apartment.size_kvm} kvm
                </p>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-neonBlue">
            Inga lägenheter matchar sökningen.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-midnight text-neonBlue border border-neonBlue rounded-lg disabled:opacity-50 hover:bg-softNavy transition"
          >
            Föregående
          </button>
          <span className="text-neonBlue">
            Sida {currentPage} av {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-midnight text-neonBlue border border-neonBlue rounded-lg disabled:opacity-50 hover:bg-softNavy transition"
          >
            Nästa
          </button>
        </div>
      )}
    </div>
  );

}
