import React from "react";

export default function LoginComp() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-orange-100 via-amber-50 to-yellow-100">
      <div className="flex flex-col justify-center items-center bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <img
          src="/images/logo.jpg"
          alt="Logo"
          className="w-48 h-48 mb-6 rounded-lg border-4 border-orange-200 shadow-md"
        />
        <form className="flex flex-col w-full" action="">
          <input
            type="email"
            placeholder="Email"
            className="mb-4 p-3 border border-orange-200 rounded-lg w-full bg-orange-50 focus:ring focus:ring-orange-300 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Lösenord"
            className="mb-4 p-3 border border-orange-200 rounded-lg w-full bg-orange-50 focus:ring focus:ring-orange-300 placeholder-gray-500"
          />
          <button
            type="submit"
            className="p-3 bg-orange-400 text-white rounded-lg w-full hover:bg-orange-500 shadow-lg"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
}
