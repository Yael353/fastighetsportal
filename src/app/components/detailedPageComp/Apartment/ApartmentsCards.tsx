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
    if (id) {
      dispatch(fetchBuildings({ id }));
    }
  }, [id, dispatch]);

  if (loading) {
    return <div className="bg-gray-900">Laddar...</div>;
  }

  if (error) {
    return <div>Fel: {error}</div>;
  }

  if (!buildingsData) {
    return <div>Ingen byggnadsdata tillgänglig.</div>;
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
    <div className="space-y-6 py-10">
      {/* Sökfält */}
      <div className="flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Sök efter lägenhetsnummer..."
          className="py-2 border border-gray-700 rounded-lg w-full max-w-md"
        />
      </div>

      {/* Lägenhetskort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
        {currentApartments.length > 0 ? (
          currentApartments.map((apartment: ApartmentResponse) => (
            <div
              key={apartment.apt_id}
              className="border bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex justify-center items-center"
            >
              <Link
                href={`/dashboard/detailedPage/${id}/singleApartment/${apartment.apt_id}`}
                className="block h-full w-full text-center"
              >
                <h2 className="text-2xl font-bold mb-2 text-white">
                  Lgh: {apartment.apt_id}
                </h2>
                <p className="text-gray-400">
                  {apartment.size_type} - {apartment.size_kvm} kvm
                </p>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-white ">
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
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded disabled:opacity-50"
          >
            Föregående
          </button>
          <span className="text-white">
            Sida {currentPage} av {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-gray-200  rounded disabled:opacity-50"
          >
            Nästa
          </button>
        </div>
      )}
    </div>
  );
}
