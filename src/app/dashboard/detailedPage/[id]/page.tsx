"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Wrench, Zap, BanknoteIcon } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data för fastighetsdetaljer
const propertyData = {
  id: "1",
  name: "Tornhuset",
  address: "Storgatan 1, Stockholm",
  type: "Kontor",
  size: 5000,
  built: 1995,
  lastRenovated: 2018,
  status: "Uthyrd",
  occupancyRate: 95,
};

// Mock data för månatlig beläggning
const occupancyData = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 95 },
  { month: 'Apr', rate: 95 },
  { month: 'Maj', rate: 96 },
  { month: 'Jun', rate: 95 },
];

// Mock data för månatliga intäkter och utgifter
const financialData = [
  { month: 'Jan', income: 450000, expenses: 150000 },
  { month: 'Feb', income: 460000, expenses: 155000 },
  { month: 'Mar', income: 475000, expenses: 160000 },
  { month: 'Apr', income: 480000, expenses: 158000 },
  { month: 'Maj', income: 490000, expenses: 162000 },
  { month: 'Jun', income: 495000, expenses: 165000 },
];

// Mock data för hyresgäster
const tenants = [
  { id: 1, name: "Tech AB", space: "Våning 3-4", area: 1200, contract: "2023-2026" },
  { id: 2, name: "Konsult & Co", space: "Våning 2", area: 800, contract: "2022-2025" },
  { id: 3, name: "Digital Byrå", space: "Våning 5", area: 600, contract: "2024-2027" },
];

// Mock data för underhållshistorik
const maintenance = [
  { id: 1, date: "2024-01-15", type: "Ventilationssystem", cost: 75000, status: "Slutförd" },
  { id: 2, date: "2023-11-20", type: "Fasadrenovering", cost: 250000, status: "Slutförd" },
  { id: 3, date: "2023-09-05", type: "Hissunderhåll", cost: 45000, status: "Slutförd" },
];

// Mock data för energiförbrukning
const energyData = [
  { month: 'Jan', consumption: 45000 },
  { month: 'Feb', consumption: 42000 },
  { month: 'Mar', consumption: 38000 },
  { month: 'Apr', consumption: 35000 },
  { month: 'Maj', consumption: 32000 },
  { month: 'Jun', consumption: 30000 },
];

// Mock data för kostnadsfördelning
const expensesBreakdown = [
  { name: 'Underhåll', value: 35 },
  { name: 'Energi', value: 25 },
  { name: 'Personal', value: 20 },
  { name: 'Försäkring', value: 10 },
  { name: 'Övrigt', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DetailedPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Översiktskort */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fastighetsstatus</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyData.name}</div>
            <Badge className="mt-1" variant={propertyData.status === "Uthyrd" ? "default" : "secondary"}>
              {propertyData.status}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beläggningsgrad</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyData.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">av total uthyrningsbar yta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Senaste underhåll</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maintenance[0].type}</div>
            <p className="text-xs text-muted-foreground">{maintenance[0].date}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Månadskostnad</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData[5].expenses.toLocaleString()} kr</div>
            <p className="text-xs text-muted-foreground">för senaste månaden</p>
          </CardContent>
        </Card>
      </div>

      {/* Flikar med detaljerad information */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Översikt</TabsTrigger>
          <TabsTrigger value="tenants">Hyresgäster</TabsTrigger>
          <TabsTrigger value="maintenance">Underhåll</TabsTrigger>
          <TabsTrigger value="finances">Ekonomi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Beläggningshistorik</CardTitle>
                <CardDescription>Beläggningsgrad över tid</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rate" name="Beläggning (%)" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Energiförbrukning</CardTitle>
                <CardDescription>Månadsvis förbrukning (kWh)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="consumption" name="Förbrukning (kWh)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants">
          <Card>
            <CardHeader>
              <CardTitle>Hyresgäster</CardTitle>
              <CardDescription>Aktiva hyreskontrakt</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Företag</TableHead>
                    <TableHead>Lokal</TableHead>
                    <TableHead>Yta (m²)</TableHead>
                    <TableHead>Kontraktsperiod</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{tenant.space}</TableCell>
                      <TableCell>{tenant.area}</TableCell>
                      <TableCell>{tenant.contract}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Underhållshistorik</CardTitle>
              <CardDescription>Genomförda underhållsåtgärder</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Åtgärd</TableHead>
                    <TableHead>Kostnad</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {maintenance.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.cost.toLocaleString()} kr</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Intäkter och Utgifter</CardTitle>
                <CardDescription>Månadsvis översikt</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={financialData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name="Intäkter" fill="#82ca9d" />
                    <Bar dataKey="expenses" name="Utgifter" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kostnadsfördelning</CardTitle>
                <CardDescription>Fördelning av utgifter</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expensesBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expensesBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

