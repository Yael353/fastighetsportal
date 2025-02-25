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
  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>Ingen data tillgänglig.</p>;

  // --- Samma logik för att bygga rows som i din befintliga kod ---
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

      if (entry.v_name === "IEM") {
        acc[key].iem = entry;
      } else if (entry.v_name === "IIAT") {
        acc[key].iiat = entry;
      } else if (entry.v_name === "IHTWM") {
        acc[key].ihtwm = entry;
      }

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
    <div className="bg-gray-700 shadow-md rounded-md w-full">
      {/* table-fixed ger kolumnerna en fördelning och w-full låter tabellen fylla föräldern */}
      <Table className="table-fixed w-full">
        <TableHeader className="bg-gray-800 font-extrabold rounded-md">
          <TableRow>
            {/* Exempel: w-1/5 för att göra alla kolumner lika breda, samt break-words för att radbryta */}
            <TableHead className="w-1/5 pl-2 py-3 text-left text-xs font-semibold uppercase  text-gray-300 break-words">
              År
            </TableHead>
            <TableHead className="w-1/5  py-3 text-left text-xs font-semibold uppercase text-gray-300 break-words">
              Månad
            </TableHead>
            <TableHead className="w-1/5  py-3 text-left text-xs font-semibold uppercase text-gray-300 break-words">
              Medeltemperatur
            </TableHead>
            <TableHead className="w-1/5  py-3 text-left text-xs font-semibold uppercase text-gray-300 break-words">
              Elförbrukning
            </TableHead>
            <TableHead className="w-1/5 pr-2 py-3 text-left text-xs font-semibold uppercase text-gray-300 break-words">
              Varmvattenförbrukning
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-800">
          {rows.map((row) => (
            <TableRow
              key={row.key}
              className="hover:bg-gray-500 transition-colors"
            >
              {/* Ta bort whitespace-nowrap så text kan brytas om kolumnen blir smal */}
              <TableCell className="pl-2 py-3 text-sm font-bold text-gray-300 break-words">
                {row.year}
              </TableCell>
              <TableCell className="py-3 text-sm font-semibold text-white break-words">
                {row.month}
              </TableCell>
              <TableCell className="py-3 text-sm text-white break-words">
                {row.iiat}
              </TableCell>
              <TableCell className="py-3 text-sm text-white break-words">
                {row.iem}
              </TableCell>
              <TableCell className="pr-2 py-3 text-sm text-white break-words">
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
