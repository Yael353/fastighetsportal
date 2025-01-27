"use client";

import React from "react";
import DetailedPageHeader from "@/app/components/detailedPageComp/DetailedPageHeader";
import SensorDataComp from "@/app/components/detailedPageComp/SensorDataComp";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store/store";

export default function DetailedPage() {
  // const propertyId = useSelector((state: RootState) => state.property.data?.id);

  // if (!propertyId) {
  //   return <p>Property not found.</p>;
  // }

  return (
    <>
      <DetailedPageHeader />
      <SensorDataComp/>
    </>
  );
}
