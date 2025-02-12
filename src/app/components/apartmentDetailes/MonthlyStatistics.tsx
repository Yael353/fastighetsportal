// components/MonthlyStatistics.tsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { AppDispatch, RootState } from "@/features/store/store";
import { fetchMonthlyApartmentStatistics } from "@/features/thunks/fetchSensors";
import { formatSensorUnit, roundSensorMetric } from "@/utils/metric";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // justera sökvägen vid behov

export interface TableRowData {
  key: string;
  year: string;
  month: string;
  iiat: string;
  iem: string;
  ihtwm: string;
}

export interface Column<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface DataTableProps {
  columns: Column<TableRowData>[];
  data: TableRowData[];
}

// Skapa DataTable-komponenten med hjälp av shadCn:s tabellkomponenter
const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={row.key}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render
                  ? col.render(row[col.dataIndex], row, rowIndex)
                  : row[col.dataIndex]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

interface MonthlyStatisticsProps {
  sensorDomainId: string;
  buildingId: string;
  apartmentId: string;
}

const columns: Column<TableRowData>[] = [
  {
    title: "År",
    dataIndex: "year",
    key: "year",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "Månad",
    dataIndex: "month",
    key: "month",
  },
  {
    title: "Medeltemperatur",
    dataIndex: "iiat",
    key: "iiat",
  },
  {
    title: "El förbrukning",
    dataIndex: "iem",
    key: "iem",
  },
  {
    title: "Varmvatten förbrukning",
    dataIndex: "ihtwm",
    key: "ihtwm",
  },
];

const MonthlyStatistics: React.FC<MonthlyStatisticsProps> = ({
  sensorDomainId,
  buildingId,
  apartmentId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Hämtar data från Redux-slicen för monthlyStatistics.
  const { data, loading, error } = useSelector(
    (state: RootState) => state.monthlyStatistics
  );

  // Vid montering (eller om parametrarna ändras) triggas thunk för att hämta data.
  useEffect(() => {
    dispatch(
      fetchMonthlyApartmentStatistics({
        sensorDomainId,
        buildingId,
        apartmentId,
      })
    );
  }, [dispatch, sensorDomainId, buildingId, apartmentId]);

  // Omvandlar den hämtade datan till ett format som passar vår DataTable-komponent.
  const tableData: TableRowData[] = useMemo(() => {
    if (!data) return [];

    const rows: TableRowData[] = [];
    // data är av typen MonthlyApartmentStatisticsResponse (ett objekt med nycklar och arrayer med statistikobjekt)
    Object.keys(data).forEach((key) => {
      const stats = data[key];

      // Hitta ut de olika värdena baserat på v_name
      const iem = stats.find((s) => s.v_name === "IEM");
      const iiat = stats.find((s) => s.v_name === "IIAT");
      const ihtwm = stats.find((s) => s.v_name === "IHTWM");

      if (iem && iiat && ihtwm) {
        rows.push({
          key,
          year: iem.year.toString(),
          // Konverterar månadsnummer till månadsnamn med moment
          month: moment(iem.month, "M").format("MMMM"),
          iem: `${roundSensorMetric(iem.u_name, iem.diff)} ${formatSensorUnit(
            iem.u_name
          )}`,
          iiat: `${roundSensorMetric(
            iiat.u_name,
            iiat.average
          )} ${formatSensorUnit(iiat.u_name)}`,
          ihtwm: `${roundSensorMetric(
            ihtwm.u_name,
            ihtwm.diff
          )} ${formatSensorUnit(ihtwm.u_name)}`,
        });
      }
    });

    // Om du vill visa den senaste månaden överst kan du reversera listan.
    return rows.reverse();
  }, [data]);

  // Rendera en laddningsindikator, felmeddelande eller tabellen
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <DataTable columns={columns} data={tableData} />
    </div>
  );
};

export default MonthlyStatistics;
