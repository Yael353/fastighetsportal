"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const fetchSensorData = async (sensorId) => {
  try {
    const response = await axios.get(
      `https://ve-api-cscv3vpmma-ew.a.run.app/open/v1/sensor_domain/efb78821-a08e-4317-8dec-5dc3e83d1d89/batch/data`,

      // fa28b06c-129c-4f46-9898-509c613354c2 utomhus temp
      // 1f52e106-7a7e-466e-b202-46e64fda5b6a forward temp
      // 37390e40-80e3-4379-b2e8-45151a7cd890 inomhus temp
      // db0660c7-2764-4fa4-a69a-31f0f82ffa08 retur vatten temp
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzYyNTk4ODYsInN1YiI6IntcImFjY291bnRfaWRcIjogXCI4NzZmZjU5ZC1iZmQzLTRmYmUtOGQ5YS04NmJjNjFjMTc2YmZcIn0ifQ.wRJYBRxPe16K5zCgIa2QHO92vWAFeSFx6-5HwmVleik", // Byt ut mot din token
        },
        params: {
          sensors: sensorId,
          freq: "raw",
          start_utc: "2025-01-07T00:00:00UTC",
          end_utc: "2025-01-07T09:14:39UTC",
        },
      }
    );

    // Omvandla API-data till Recharts-dataformat
    return response.data.sensor_data[0]?.data.map((entry) => ({
      time: entry.time_utc.split("T")[1].replace("UTC", "").slice(0, 5), // Extrahera tid i HH:MM-format
      value: entry.value,
    }));
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return [];
  }
};

export default function TemperatureCard() {
  const [outdoorTemp, setOutdoorTemp] = useState([]);
  const [forwardTemp, setForwardTemp] = useState([]);
  const [indoorTemp, setIndoorTemp] = useState([]);
  const [returnWaterTemp, setReturnWaterTemp] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      // Hämta data för varje sensor
      const outdoor = await fetchSensorData("fa28b06c-129c-4f46-9898-509c613354c2"); // Utomhustemperatur
      const forward = await fetchSensorData("1f52e106-7a7e-466e-b202-46e64fda5b6a"); // Byt till framledningstemperatur-ID
      const indoor = await fetchSensorData("37390e40-80e3-4379-b2e8-45151a7cd890"); // Byt till inomhustemperatur-ID
      const returnWater = await fetchSensorData("db0660c7-2764-4fa4-a69a-31f0f82ffa08"); // Byt till returvattentemperatur-ID

      setOutdoorTemp(outdoor);
      setForwardTemp(forward);
      setIndoorTemp(indoor);
      setReturnWaterTemp(returnWater);
      setLoading(false);
    };

    fetchAllData();
  }, []);

  if (loading) return <p>Loading data...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Utomhustemperatur</CardTitle>
          <CardDescription>Outdoor air temperature</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={outdoorTemp}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Temperatur (°C)" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Framledningstemperatur</CardTitle>
          <CardDescription>Forward water temperature</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forwardTemp}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Temperatur (°C)" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inomhuslufttemperatur</CardTitle>
          <CardDescription>Indoor air temperature</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={indoorTemp}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Temperatur (°C)" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Returvattentemperatur</CardTitle>
          <CardDescription>Return water temperature</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={returnWaterTemp}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" name="Temperatur (°C)" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
