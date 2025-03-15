"use client";

import React, { useEffect, useState } from "react";
import DetailedPageHeader from "@/app/components/detailedPageComp/DetailedPageHeader";
import SensorDataComp from "@/app/components/detailedPageComp/SensorDataComp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
import { useParams } from "next/navigation";
import { getAuthToken } from "@/utils/auth";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import ApartmentsCards from "@/app/components/detailedPageComp/apartment/ApartmentsCards";

export default function DetailedPage() {
  type UserParams = {
    id: string;
  };

  const authToken = getAuthToken();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams<UserParams>();

  useEffect(() => {
    if (id && authToken) {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [id, authToken, dispatch]);

  return (
    <div className="bg-darkBg h-screen">
      <div className="">
        <DetailedPageHeader />
      </div>
      <div className="bg-darkBg">
        <SensorDataComp id={id} />
        {/* <ApartmentsCards /> */}
      </div>
    </div>
  );
}
