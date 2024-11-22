import React from "react";
import Link from "next/link";
import LoginComp from "@/components/login/LoginComp";

export default function Login() {
  return (
    <div>
      <h1>Loginpage</h1>

      <LoginComp />
      <Link href="./overview">
        <button>Go to overview</button>
      </Link>
    </div>
  );
}
