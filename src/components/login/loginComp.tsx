import Link from "next/link";
import React from "react";

export default function LoginComp() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen  bg-gradient-to-b from-orange-100 via-amber-100 to-yellow-200">
      <div className="relative bg-gradient-to-b from-amber-800 via-amber-700 to-amber-600 rounded-xl shadow-2xl p-8 max-w-sm w-full border border-amber-500">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="w-28 h-28 rounded-full border-4 border-orange-300 shadow-lg bg-white"
          />
        </div>
        <h2 className="text-center text-2xl text-white font-bold mb-6 mt-12">
          rubrik
        </h2>
        <form className="flex flex-col w-full space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 border border-amber-400 rounded-lg w-full bg-white text-black placeholder-amber-300 focus:ring focus:ring-orange-300 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Lösenord"
            className="p-3 border border-amber-400 rounded-lg w-full bg-white text-black placeholder-amber-300 focus:ring focus:ring-orange-300 focus:outline-none"
          />
          <Link href="./overview">
            <button
              type="submit"
              className="p-3 bg-orange-300 text-white rounded-lg w-full hover:bg-orange-600 shadow-lg"
            >
              Logga in
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
