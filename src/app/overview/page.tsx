import React from "react";
import Link from "next/link";

export default function Overview() {
  return (
    <div>
      <h1>hello from overview</h1>

      <Link href="./detailpage">
        <button className="border-1 bg-white text-black">
          Gå till detailpage
        </button>
      </Link>
    </div>
  );
}
