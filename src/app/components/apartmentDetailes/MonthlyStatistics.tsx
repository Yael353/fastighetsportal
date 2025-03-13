import React from "react";
import { MonthlyApartmentStatisticsResponse } from "@/features/models/statistics";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface Props {
  data: MonthlyApartmentStatisticsResponse | null;
  loading: boolean;
  error: string | null;
}

interface Entry {
  year: number;
  month: number;
  v_name: "IEM" | "IIAT" | "IHTWM";
  diff?: number;
  average?: number;
  u_name: string;
}

interface AggregatedEntry {
  year: number;
  month: number;
  date: Date;
  iem: Entry | null;
  iiat: Entry | null;
  ihtwm: Entry | null;
}

interface TableRowData {
  key: string;
  year: string;
  month: string;
  iem: string;
  iiat: string;
  ihtwm: string;
}

const MonthlyStatistics: React.FC<Props> = ({ data, loading, error }) => {
  if (loading) return <p className="text-neonBlue">Laddar...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p className="text-gray-300">Ingen data tillgänglig.</p>;

  const tableData: Record<string, AggregatedEntry> = Object.values(data)
    .flat()
    .reduce((acc, entry: Entry) => {
      const key = `${entry.year}-${entry.month}`;
      if (!acc[key]) {
        acc[key] = {
          year: entry.year,
          month: entry.month,
          date: new Date(entry.year, entry.month - 1),
          iem: null,
          iiat: null,
          ihtwm: null,
        };
      }

      if (entry.v_name === "IEM") acc[key].iem = entry;
      else if (entry.v_name === "IIAT") acc[key].iiat = entry;
      else if (entry.v_name === "IHTWM") acc[key].ihtwm = entry;

      return acc;
    }, {} as Record<string, AggregatedEntry>);

  const rows: TableRowData[] = Object.values(tableData)
    .map((entry, index) => ({
      key: `${entry.year}-${entry.month}-${index}`,
      year: entry.year.toString(),
      month: new Date(entry.year, entry.month - 1).toLocaleString("default", {
        month: "long",
      }),
      iem: entry.iem
        ? `${parseFloat((entry.iem.diff ?? 0).toFixed(2))} ${entry.iem.u_name}`
        : "N/A",
      iiat: entry.iiat
        ? `${parseFloat((entry.iiat.average ?? 0).toFixed(2))} ${
            entry.iiat.u_name
          }`
        : "N/A",
      ihtwm: entry.ihtwm
        ? `${parseFloat((entry.ihtwm.diff ?? 0).toFixed(2))} ${
            entry.ihtwm.u_name
          }`
        : "N/A",
    }))
    .reverse()
    .sort(
      (a, b) =>
        new Date(b.year, b.month, 1).getTime() -
        new Date(a.year, a.month, 1).getTime()
    )
    .slice(0, 18);

  return (
    <div className="bg-darkBg shadow-lg rounded-md w-full border border-neonBlue pb-4">
      <Table className="w-full ">
        <TableHeader className="bg-darkBgLight text-neonBlue">
          <TableRow className="sticky top-0 bg-darkBgLight text-neonBlue">
            <TableHead className="w-1/5 px-4 py-3 text-left uppercase">
              År
            </TableHead>
            <TableHead className="w-1/5 px-4 py-3 text-left uppercase">
              Månad
            </TableHead>
            <TableHead className="w-1/5 px-4 py-3 text-left uppercase">
              Medeltemperatur
            </TableHead>
            <TableHead className="w-1/5 px-4 py-3 text-left uppercase">
              Elförbrukning
            </TableHead>
            <TableHead className="w-1/5 px-4 py-3 text-left uppercase">
              Varmvattenförbrukning
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-700">
          {rows.map((row) => (
            <TableRow
              key={row.key}
              className="hover:bg-gray-600 transition-all duration-200"
            >
              <TableCell className="px-4 py-3 text-sm text-neonBlue">
                {row.year}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-white">
                {row.month}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-white">
                {row.iiat}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-white">
                {row.iem}
              </TableCell>
              <TableCell className="px-4 py-3 text-sm text-white">
                {row.ihtwm}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MonthlyStatistics;
