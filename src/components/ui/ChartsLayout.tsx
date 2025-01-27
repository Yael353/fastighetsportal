"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Dummy data - replace with your actual data
const data1 = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 150 },
  { month: "Apr", value: 300 },
  { month: "May", value: 250 },
  { month: "Jun", value: 400 },
]

const data2 = [
  { month: "Jan", value: 50 },
  { month: "Feb", value: 100 },
  { month: "Mar", value: 75 },
  { month: "Apr", value: 150 },
  { month: "May", value: 125 },
  { month: "Jun", value: 200 },
]

const data3 = [
  { month: "Jan", line1: 100, line2: 150, line3: 200 },
  { month: "Feb", line1: 200, line2: 250, line3: 300 },
  { month: "Mar", line1: 150, line2: 200, line3: 250 },
  { month: "Apr", line1: 300, line2: 350, line3: 400 },
  { month: "May", line1: 250, line2: 300, line3: 350 },
  { month: "Jun", line1: 400, line2: 450, line3: 500 },
]

export default function ChartsLayout() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>Försäljning</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Försäljning",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data1}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-sales)" name="Försäljning" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Besökare</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: {
                  label: "Besökare",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data2}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-visitors)" name="Besökare" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Jämförelse</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              line1: {
                label: "Intäkter",
                color: "hsl(var(--chart-1))",
              },
              line2: {
                label: "Kostnader",
                color: "hsl(var(--chart-2))",
              },
              line3: {
                label: "Vinst",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data3}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="line1" stroke="var(--color-line1)" name="Intäkter" />
                <Line type="monotone" dataKey="line2" stroke="var(--color-line2)" name="Kostnader" />
                <Line type="monotone" dataKey="line3" stroke="var(--color-line3)" name="Vinst" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

