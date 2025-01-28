"use client";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartsLayout from "@/components/ui/ChartsLayout";
import ApartmentComp from "./apartment/ApartmentComp";

// Mock data för månatlig beläggning
const occupancyData = [
  { month: "Jan", rate: 92 },
  { month: "Feb", rate: 94 },
  { month: "Mar", rate: 95 },
  { month: "Apr", rate: 95 },
  { month: "Maj", rate: 96 },
  { month: "Jun", rate: 95 },
];
// Mock data för månatliga intäkter och utgifter
const financialData = [
  { month: "Jan", income: 450000, expenses: 150000 },
  { month: "Feb", income: 460000, expenses: 155000 },
  { month: "Mar", income: 475000, expenses: 160000 },
  { month: "Apr", income: 480000, expenses: 158000 },
  { month: "Maj", income: 490000, expenses: 162000 },
  { month: "Jun", income: 495000, expenses: 165000 },
];
// Mock data för hyresgäster
const tenants = [
  {
    id: 1,
    name: "Tech AB",
    space: "Våning 3-4",
    area: 1200,
    contract: "2023-2026",
  },
  {
    id: 2,
    name: "Konsult & Co",
    space: "Våning 2",
    area: 800,
    contract: "2022-2025",
  },
  {
    id: 3,
    name: "Digital Byrå",
    space: "Våning 5",
    area: 600,
    contract: "2024-2027",
  },
];

// Mock data för energiförbrukning
const energyData = [
  { month: "Jan", consumption: 45000 },
  { month: "Feb", consumption: 42000 },
  { month: "Mar", consumption: 38000 },
  { month: "Apr", consumption: 35000 },
  { month: "Maj", consumption: 32000 },
  { month: "Jun", consumption: 30000 },
];

export default function SensorDataComp() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">UC Sensorer</TabsTrigger>
          <TabsTrigger value="apartments">Lägenheter</TabsTrigger>
          {/* <TabsTrigger value="maintenance">Underhåll</TabsTrigger>
          <TabsTrigger value="finances">Ekonomi</TabsTrigger> */}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="container mx-auto p-4">
            <ChartsLayout />
          </div>
        </TabsContent>

        <TabsContent value="apartments">
          <ApartmentComp/>
        </TabsContent>

        {/*
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
