"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchSensorDomain } from "@/features/thunks/fetchSensors";

// Typ för Marker props
// interface MarkerProps {
//   lat: number;
//   lng: number;
//   text: string;
// }

// Komponent för att visa markör

export default function DetailedPageHeader() {
  const { id } = useParams(); // Hämta ID från URL
  const dispatch = useDispatch<AppDispatch>();

  // Hämta sensordomain-data från Redux-storen
  const { data, loading, error } = useSelector(
    (state: RootState) => state.property
  );

  // Hämta sensordomain-data när komponenten mountar
  useEffect(() => {
    if (typeof id === "string") {
      dispatch(fetchSensorDomain({ id })); // Hämtar data med ID från URL
    }
  }, [id, dispatch]);

  // Hantering av olika tillstånd
  if (loading) return <p>Loading property data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No property data found for ID: {id}</p>;

  const { name, location } = data; // Extrahera namn och plats från data

  return (
    <div className="space-y-6">
      {/* Google Map */}
      <div style={{ height: "300px", width: "100%" }} className="">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        >
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            zoom={15}
          >
            <Marker
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              label={name}
            />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">{name}</CardTitle>
        </CardHeader>
      </Card>

      {/* Additional Information */}
      <Card></Card>
    </div>
  );
}















// return (
//     <div className="space-y-6">
//       {/* Property Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-center text-xl font-bold text-gray-800 tracking-wide first-letter:uppercase">
//             {name}
//           </CardTitle>
//           {/* <CardDescription>
//             Location: Latitude {location.latitude}, Longitude{" "}
//             {location.longitude}
//           </CardDescription> */}
//         </CardHeader>
//         <CardContent>
//           <p>Here is some detailed information about the property.</p>
//         </CardContent>
//       </Card>

//       {/* Google Map */}
//       {/* <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-center">Map</CardTitle>
//         </CardHeader>
//         <CardContent style={{ height: "400px" }}>
//           <GoogleMapReact
//             bootstrapURLKeys={{
//               key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
//             }}
//             defaultCenter={position}
//             defaultZoom={15}
//           >
//             <Marker lat={position.lat} lng={position.lng} text="Here" />
//           </GoogleMapReact>
//         </CardContent>
//       </Card> */}

//       {/* Render Sensors */}
//       {/* {sensors.map((sensor) => (
//         <Card key={sensor.id}>
//           <CardHeader>
//             <CardTitle>{sensor.name}</CardTitle>
//             <CardDescription>Sensor ID: {sensor.id}</CardDescription>
//           </CardHeader>
//         </Card>
//       ))}
//       */}
//     </div>
//   );
// }

// /* //Rendera sensorerna
// {sensors.map((sensor) => (
// <Card key={sensor.id}>
//   <CardHeader>
//     <CardTitle>{sensor.name}</CardTitle>
//     <CardDescription>Sensor ID: {sensor.id}</CardDescription>
//   </CardHeader>
//    <CardContent>
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={sensor.data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="time" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line
//           type="monotone"
//           dataKey="value"
//           name="Value"
//           stroke="#8884d8"
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   </CardContent> */
// {
// }
// {
//   /* </Card> */
// }
// {
//   /* //   ))} */
// }