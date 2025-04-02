"use client";
import ChartsLayout from "@/app/components/ChartsLayout";
import ApartmentComp from "./apartment/ApartmentComp";
import ApartmentsCards from "./apartment/ApartmentsCards";
import AlgoOverView from "./algoOverview/AlgoOverView";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store/store";

interface SensorDataCompProps {
  id: string;
}

export default function SensorDataComp({ id }: SensorDataCompProps) {
  const property = useSelector((state: RootState) => state.property.data);
  const controllers = property?.controllers ?? [];

  // Säkerställ att endast ett controllerId används
  const firstControllerId =
    controllers.length > 0
      ? Array.isArray(controllers[0].id)
        ? controllers[0].id[0]
        : controllers[0].id
      : null;

  return (
    <div className="w-full py-6 space-y-6 bg-darkBg px-4">
      <div className="space-y-6">
        <AlgoOverView
          key={firstControllerId}
          controllerId={firstControllerId}
        />

        <ChartsLayout id={id} />
        <ApartmentComp />
        <ApartmentsCards />
      </div>
    </div>
  );
}
