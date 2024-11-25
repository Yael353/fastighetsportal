import React from "react";
import Link from "next/link";
import SearchBar from "@/components/overViewComp/SearchBar";

export default function Overview() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Översikt</h1>
      <SearchBar />
      <Link href="./detailpage">
        <button className="border-1 bg-white text-black">
          Gå till detailpage
        </button>
      </Link>
    </div>
  );
}
