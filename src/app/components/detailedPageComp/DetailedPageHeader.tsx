"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";
import GoogleMapReact from "google-map-react";

// Marker komponenten som nu tar emot lat, lng och text
const Marker = ({
  lat,
  lng,
  text,
}: {
  lat: number;
  lng: number;
  text: string;
}) => (
  <div
    style={{
      color: "white",
      background: "red",
      padding: "10px",
      borderRadius: "50%",
      textAlign: "center",
    }}
  >
    {text}
  </div>
);

export default function DetailedPageHeader() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.property
  );

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchSensorDomain({ id }));
    }
  }, [id, dispatch]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data found for this property.</p>;

  const { name, location, sensors } = data;

  const position = {
    lat: location.latitude,
    lng: location.longitude,
  };

  return (
    <div className="space-y-6">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center text-xl font-bold text-gray-800 tracking-wide first-letter:uppercase">
            {name}
          </CardTitle>
          {/* <CardDescription>
            Location: Latitude {location.latitude}, Longitude{" "}
            {location.longitude}
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <p>Here is some detailed information about the property.</p>
        </CardContent>
      </Card>

      {/* Google Map */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">Map</CardTitle>
        </CardHeader>
        <CardContent style={{ height: "400px" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
            }}
            defaultCenter={position}
            defaultZoom={15}
          >
            <Marker lat={position.lat} lng={position.lng} text="Here" />
          </GoogleMapReact>
        </CardContent>
      </Card> */}

      {/* Render Sensors */}
      {/* {sensors.map((sensor) => (
        <Card key={sensor.id}>
          <CardHeader>
            <CardTitle>{sensor.name}</CardTitle>
            <CardDescription>Sensor ID: {sensor.id}</CardDescription>
          </CardHeader>
        </Card>
      ))}
      */}
    </div>
  );
}

/* //Rendera sensorerna
{sensors.map((sensor) => (
<Card key={sensor.id}>
  <CardHeader>
    <CardTitle>{sensor.name}</CardTitle>
    <CardDescription>Sensor ID: {sensor.id}</CardDescription>
  </CardHeader>
   <CardContent>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={sensor.data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name="Value"
          stroke="#8884d8"
        />
      </LineChart>
    </ResponsiveContainer>
  </CardContent> */
{
}
{
  /* </Card> */
}
{
  /* //   ))} */
}
