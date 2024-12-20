"use client";
import { CartesianGrid, Line, LineChart, XAxis, Tooltip } from "recharts";

const chartData = [
  { desktop: 186, mobile: 80 },
  { desktop: 305, mobile: 200 },
  { desktop: 237, mobile: 120 },
  { desktop: 73, mobile: 190 },
  { desktop: 209, mobile: 130 },
  { desktop: 214, mobile: 140 },
];

export function ChartTest() {
  return (
    <div className="w-full h-24 flex justify-center items-center">
      <LineChart
        width={600}
        height={100}
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: 10,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        {/* <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        /> */}
        <Tooltip />
        <Line
          type="monotone"
          dataKey="desktop"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{
            fill: "#8884d8",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </div>
  );
}
