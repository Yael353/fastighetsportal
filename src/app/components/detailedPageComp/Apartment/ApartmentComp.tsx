import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store/store";
import { getList } from "@/features/slices/overviewSlice";
import { getAuthToken } from "@/utils/auth";
import { fetchAlgoConfig } from "@/features/thunks/algoConfig";

interface ApartmentCompProps {
  id: string;
}

export default function ApartmentComp({ id }: ApartmentCompProps) {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = getAuthToken();

  // State and selector hooks
  const sensorDomains = useSelector(
    (state: RootState) => state.overview.sensorDomains
  );

  const [isLoading, setIsLoading] = useState(true);

  // Fetch sensor domains if auth token is available
  useEffect(() => {
    if (authToken) {
      dispatch(getList());
    } else {
      console.error("Ingen giltig autentisering tillgänglig.");
    }
  }, [dispatch, authToken]);

  // Mark loading as false once sensorDomains is available
  useEffect(() => {
    if (sensorDomains) {
      setIsLoading(false);
    }
  }, [sensorDomains]);

  // Find the sensor domain for the given ID
  const sensorDomain = sensorDomains?.data.find((item) => item.id === id);

  console.log("sensordomain", sensorDomain);
  

  // Extract controllers and controller IDs
  const controllers = sensorDomain?.controllers || [];
  const controllerIds = controllers.map((controller) => controller.id);
  const seperatedIds = controllerIds.join(",");

  console.log("lista ", controllerIds);
 
  useEffect(() => {
    if (authToken && controllerIds.length > 0) {
      controllerIds.forEach((element) => {
        dispatch(fetchAlgoConfig(element));
      });
      console.log("Separedade2", seperatedIds);
    }
  }, [authToken, JSON.stringify(controllerIds), dispatch]);

  // Render logic (no hooks inside this conditional block)
  if (isLoading) {
    return <div>Laddar...</div>;
  }

  if (!sensorDomain) {
    return <div>Ingen sensor domain hittades för det här ID:t.</div>;
  }

  return <></>;
}
