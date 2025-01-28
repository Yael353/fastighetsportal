"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/features/store/store";
import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
import React, { useEffect } from "react";

// Omvandlingsfunktion för API-data
const transformSensorData = (apiResponse: any) => {
  if (apiResponse?.sensor_data?.length > 0) {
    return apiResponse.sensor_data[0].data.map((entry: any) => {
      // Konvertera tidsstämpeln korrekt
      const time = moment(entry.time_utc, "YYYY-MM-DDTHH:mm:ss[UTC]").format("HH:mm");
      return {
        time,
        value: entry.value,
      };
    });
  }
  return [];
};


export default function ChartsLayout() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state för alla sensorer
  const { sensorData: outdoorData, loading: outdoorLoading, error: outdoorError } = useSelector(
    (state: RootState) => state.sensorData.outdoor
  );
  const { sensorData: indoorData, loading: indoorLoading, error: indoorError } = useSelector(
    (state: RootState) => state.sensorData.indoor
  );
  const { sensorData: supplyData, loading: supplyLoading, error: supplyError } = useSelector(
    (state: RootState) => state.sensorData.supply
  );
  const { sensorData: returnData, loading: returnLoading, error: returnError } = useSelector(
    (state: RootState) => state.sensorData.return
  );
  console.log("Outdoor Data:", outdoorData);
  console.log("Indoor Data:", indoorData);
  // Hämta data för alla sensorer
  useEffect(() => {
    dispatch(
      fetchBatchSensorData({
        sensorDomainId: "254a7230-eb10-4035-aeef-aedfdc8283b5",
        sensorIds: ["3516f208-56cc-4a70-b00b-24b6861f2fff"], // Utomhus
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: "raw",
      })
    );

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: "254a7230-eb10-4035-aeef-aedfdc8283b5",
        sensorIds: ["e025317f-31ac-407e-b623-717cb7b9fcee"], // Inomhus
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: "raw",
      })
    );

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: "254a7230-eb10-4035-aeef-aedfdc8283b5",
        sensorIds: ["89101239-7002-402d-a149-68b5acc672a5"], // Framledning
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: "raw",
      })
    );

    dispatch(
      fetchBatchSensorData({
        sensorDomainId: "254a7230-eb10-4035-aeef-aedfdc8283b5",
        sensorIds: ["2fe472be-39e9-4c8b-a94d-c0d2d937e149"], // Returledning
        startUtc: moment().subtract(1, "day"),
        endUtc: moment(),
        freq: "raw",
      })
    );
  }, [dispatch]);

  // Omvandla data för varje sensor
  const outdoorTransformed = transformSensorData(outdoorData);
  const indoorTransformed = transformSensorData(indoorData);
  const supplyTransformed = transformSensorData(supplyData);
  const returnTransformed = transformSensorData(returnData);

  if (outdoorLoading || indoorLoading || supplyLoading || returnLoading) {
    return <p>Loading...</p>;
  }

  if (outdoorError || indoorError || supplyError || returnError) {
    return <p>Error loading data</p>;
  }


  
  // Konfiguration för varje diagram
  const outdoorConfig = {
    outdoor: {
      label: "Utomhus",
      theme: { light: "#3498db", dark: "#2980b9" },
    },
  };

  const indoorConfig = {
    indoor: {
      label: "Inomhus",
      theme: { light: "#f39c12", dark: "#d35400" },
    },
  };

  const comparisonConfig = {
    line1: {
      label: "Framledning",
      theme: { light: "#27ae60", dark: "#1e8449" },
    },
    line2: {
      label: "Börvärde",
      theme: { light: "#8e44ad", dark: "#5b2c6f" },
    },
    line3: {
      label: "Returledning",
      theme: { light: "#e74c3c", dark: "#c0392b" },
    },
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {/* Utomhus temperatur */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Utomhus temperatur</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer id="outdoor" config={outdoorConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={outdoorTransformed}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="var(--color-sales)" name="Utomhus" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Inomhus temperatur */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Inomhus temperatur</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer id="indoor" config={indoorConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={indoorTransformed}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="var(--color-visitors)" name="Inomhus" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Jämförelse: Framledning, Börvärde, Returledning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Jämförelse</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer id="comparison" config={comparisonConfig} className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={supplyTransformed.map((entry, index) => ({
                  time: entry.time,
                  line1: entry.value,
                  line2: indoorTransformed[index]?.value || 0,
                  line3: returnTransformed[index]?.value || 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="line1" stroke="var(--color-line1)" name="Framledning" />
                <Line type="monotone" dataKey="line2" stroke="var(--color-line2)" name="Börvärde" />
                <Line type="monotone" dataKey="line3" stroke="var(--color-line3)" name="Returledning" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}



// export default function ChartsLayout() {
//     return (
//       <div className="flex flex-col gap-2">
//         <div className="grid grid-cols-2 gap-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-center">Utomhus temperatur</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer
//                 config={{
//                   sales: {
//                     label: "Försäljning",
//                     color: "hsl(var(--chart-1))",
//                   },
//                 }}
//                 className="h-[300px] w-full"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={data1}>
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Line type="monotone" dataKey="value" stroke="var(--color-sales)" name="Försäljning" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-center">Inomhus temperatur</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ChartContainer
//                 config={{
//                   visitors: {
//                     label: "Besökare",
//                     color: "hsl(var(--chart-2))",
//                   },
//                 }}
//                 className="h-[300px] w-full"
//               >
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={data2}>
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <ChartTooltip content={<ChartTooltipContent />} />
//                     <Line type="monotone" dataKey="value" stroke="var(--color-visitors)" name="Besökare" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </CardContent>
//           </Card>
//         </div>
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-center">Jämförelse</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ChartContainer
//               config={{
//                 line1: {
//                   label: "Framlednings temperatur",
//                   color: "hsl(var(--chart-1))",
//                 },
//                 line2: {
//                   label: "Framledningstemperatur (Börvärde)",
//                   color: "hsl(var(--chart-2))",
//                 },
//                 line3: {
//                   label: "Retur temperatur",
//                   color: "hsl(var(--chart-3))",
//                 },
//               }}
//               className="h-[400px] w-full"
//             >
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={data3}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <ChartTooltip content={<ChartTooltipContent />} />
//                   <Legend />
//                   <Line type="monotone" dataKey="line1" stroke="var(--color-line1)" name="Framlednings temperatur" />
//                   <Line type="monotone" dataKey="line2" stroke="var(--color-line2)" name="Framledningstemperatur (Börvärde)" />
//                   <Line type="monotone" dataKey="line3" stroke="var(--color-line3)" name="Retur temperatur" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </ChartContainer>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }
  
  
