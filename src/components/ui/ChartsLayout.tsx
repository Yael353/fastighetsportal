"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/features/store/store";
import { getList } from "@/features/slices/overviewSlice";
import { fetchBatchSensorData } from "@/features/thunks/fetchSensors";
import React, { useEffect } from "react";
import moment from "moment";

const ChartsLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Hämta sensorDomains från Redux
  const { sensorDomains, loading, error } = useSelector(
    (state: RootState) => state.overview
  );

  // ✅ Hämta sensordata från den nya slicen
  const sensorDataState = useSelector((state: RootState) => state.sensorData.sensors);

  // ✅ Logga sensorDomains direkt efter att de hämtas
  useEffect(() => {
    console.log("📡 SensorDomains från Redux:", sensorDomains);
  }, [sensorDomains]);

  // ✅ Hämta sensorDomains vid mount
  useEffect(() => {
    dispatch(getList({ offset: 0, limit: 10 }));
  }, [dispatch]);

  // ✅ Hämta sensordata
  useEffect(() => {
  
    if (!sensorDomains || !Array.isArray(sensorDomains) || sensorDomains.length === 0) {
      console.warn("⚠️ Inga sensorDomains hittades!");
      return;
    }
  
    sensorDomains.forEach((domain) => {
      if (!domain.sensors || domain.sensors.length === 0) {
        console.warn(`⚠️ SensorDomain "${domain.name}" har inga sensorer!`);
        return;
      }
  
      const sensorIds = domain.sensors.map((sensor) => sensor.id);
  
      console.log(`📡 Dispatchar fetchBatchSensorData för ${domain.name}:`, sensorIds);
  
      dispatch(
        fetchBatchSensorData({
          sensorDomainId: domain.id,
          sensorIds,
          startUtc: moment().subtract(1, "day"),
          endUtc: moment(),
          freq: "raw",
        })
      );
    });
  }, [dispatch, sensorDomains]);
  

  // ✅ Logga sensordata efter att den hämtas
  useEffect(() => {
    console.log("📡 SensorData i Redux:", sensorDataState);
  }, [sensorDataState]);
  

  if (loading) {
    return <p>🔄 Loading sensor domains...</p>;
  }

  if (error) {
    return <p>❌ Error loading sensor domains: {error}</p>;
  }

  return <p>✅ Kolla konsolen för sensorDomains och SensorData!</p>;
};

export default ChartsLayout;




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
