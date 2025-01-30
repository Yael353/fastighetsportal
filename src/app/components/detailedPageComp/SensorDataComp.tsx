"use client";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartsLayout from "@/components/ui/ChartsLayout";
import ApartmentComp from "./apartment/ApartmentComp";

interface SensorDataCompProps {
  id: string; // 🔹 Acceptera `id` som en prop
}

export default function SensorDataComp({ id }: SensorDataCompProps) {
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
          <div className="container mx-auto ">
            <ChartsLayout />
          </div>
        </TabsContent>

        <TabsContent value="apartments">
          <ApartmentComp id={id} />
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
