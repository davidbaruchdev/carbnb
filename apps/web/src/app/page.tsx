"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  return (
    <main className="min-h-screen bg-amber-50 relative">
      {/* Wallet Button - Fixed top right */}
      <div className="absolute top-4 right-4 z-20">
        {isConnected ? (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {address?.slice(0, 6)}...{address?.slice(-4)}
            <button 
              onClick={() => disconnect()}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="bg-slate-700 text-white px-6 py-2 rounded-full text-sm hover:bg-slate-800"
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Background map pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#d4a574" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Logo */}
        <header className="flex justify-center pt-8 pb-4">
          <img src="/logo.png" alt="CarbNB" className="h-64" />
        </header>

        {/* Search Card */}
        <div className="flex-1 flex items-start justify-center px-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
            {/* Location Input */}
            <div className="mb-4">
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 outline-none text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="flex-1">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full outline-none text-slate-700"
                  />
                  <p className="text-sm text-slate-400 mt-1">Add return date</p>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button className="w-full bg-slate-700 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition">
              Search
            </button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-slate-700 py-4 px-8 flex justify-around items-center">
          <button className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
          <button className="bg-white rounded-full p-2">
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </nav>
      </div>
    </main>
  );
}