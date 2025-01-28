import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { RootState } from "@/features/store/store";

const ApartmentComp: React.FC = () => {
  const algoConfig = useSelector((state: RootState) => state.algoConfig.data);
  const summaryStatistics = useSelector(
    (state: RootState) => state.summaryStatistics.data
  );

  const isLoading =
    useSelector((state: RootState) => state.algoConfig.loading) ||
    useSelector((state: RootState) => state.summaryStatistics.loading);

  const error =
    useSelector((state: RootState) => state.algoConfig.error) ||
    useSelector((state: RootState) => state.summaryStatistics.error);

  console.log("AlgoConfig:", algoConfig);
  console.log("SummaryStatistics:", summaryStatistics);

  // Filtrera statistik för de senaste 30 dagarna
  const filteredStatistics = useMemo(() => {
    if (!summaryStatistics) return null;

    const thirtyDaysAgo = moment().subtract(30, "days");

    return Object.entries(summaryStatistics).reduce(
      (acc, [sizeType, stats]) => {
        const filteredStats = stats.filter((stat) =>
          moment(stat.timestamp).isAfter(thirtyDaysAgo)
        );
        if (filteredStats.length > 0) {
          acc[sizeType] = filteredStats;
        }
        return acc;
      },
      {} as typeof summaryStatistics
    );
  }, [summaryStatistics]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!filteredStatistics || !algoConfig) {
    return <p>No data available</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(filteredStatistics).map(([sizeType, stats]) => (
        <div
          key={sizeType}
          className="card bg-gray-100 p-4 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold mb-2">{sizeType}</h2>
          {stats.map((stat, index) => (
            <div key={index} className="mb-2">
              <p className="text-lg font-medium">
                {stat.avg.toFixed(1)} {stat.u_name}
              </p>
            </div>
          ))}
          <div className="mt-4 text-sm text-gray-500">
            Temperatur (komfort): {algoConfig.iat_sp.toFixed(2)} °C
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApartmentComp;
