import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchBuildings } from "@/features/thunks/fetchSensors";

export default function BuildingsPage() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.buildings
  );

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchBuildings({ id }));
    }
  }, [id, dispatch]);

  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No buildings found for ID: {id}</p>;

  return (
    <div>
      <h1>Buildings</h1>
      <ul>
        {Object.entries(data).map(([buildingId, building]) => (
          <li key={buildingId}>
            <h2>Building ID: {buildingId}</h2>
            <ul>
              {building.apartments.map((apartment: any) => (
                <li key={apartment.apt_id}>
                  <h3>Apartment ID: {apartment.apt_id}</h3>
                  <p>Size Type: {apartment.size_type}</p>
                  <ul>
                    <li>
                      <h4>Sensors:</h4>
                      <ul>
                        {apartment.sensors.map((sensor: any) => (
                          <li key={sensor.id}>
                            <p>Unit: {sensor.vala_description.unit}</p>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li>
                      <h4>Apartment Metadata:</h4>
                      {/* <p>
                        Size (kvm):{" "}
                        {apartment.apartment_metadata.size_kvm}
                      </p> */}
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

}
