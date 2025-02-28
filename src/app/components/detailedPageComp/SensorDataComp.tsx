"use client";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartsLayout from "@/app/components/ChartsLayout";
import ApartmentComp from "./apartment/ApartmentComp";

interface SensorDataCompProps {
  id: string;
}

export default function SensorDataComp({ id }: SensorDataCompProps) {
  return (
    <div className="w-full py-6 space-y-6 bg-gray-900 px-4">
      <div className="space-y-6">
        <ChartsLayout id={id} />
        <ApartmentComp />
      </div>
    
    </div>
  );
}
