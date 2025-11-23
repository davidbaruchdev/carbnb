"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

type Tab = "search" | "list" | "rentals";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  
  // List car form
  const [carModel, setCarModel] = useState("");
  const [carCity, setCarCity] = useState("");
  const [carPrice, setCarPrice] = useState("");

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

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Logo */}
        <header className="flex justify-center pt-8 pb-4">
          <img src="/logo.png" alt="CarbNB" className="h-48" />
        </header>

        {/* Content Area */}
        <div className="flex-1 flex items-start justify-center px-4">
          
          {/* SEARCH TAB */}
          {activeTab === "search" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
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

              <button className="w-full bg-slate-700 text-white py-4 rounded-xl font-semibold hover:bg-slate-800 transition">
                Search
              </button>
            </div>
          )}

          {/* LIST CAR TAB */}
          {activeTab === "list" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">List Your Car</h2>
              
              {!isConnected ? (
                <p className="text-center text-slate-500">Connect wallet to list your car</p>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                      <span className="text-xl">🚗</span>
                      <input
                        type="text"
                        placeholder="Car model (e.g. Toyota Corolla)"
                        value={carModel}
                        onChange={(e) => setCarModel(e.target.value)}
                        className="flex-1 outline-none text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                      <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="City"
                        value={carCity}
                        onChange={(e) => setCarCity(e.target.value)}
                        className="flex-1 outline-none text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl">
                      <span className="text-xl">💵</span>
                      <input
                        type="number"
                        placeholder="Price per day (cUSD)"
                        value={carPrice}
                        onChange={(e) => setCarPrice(e.target.value)}
                        className="flex-1 outline-none text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 transition">
                    List Car
                  </button>
                </>
              )}
            </div>
          )}

          {/* RENTALS TAB */}
          {activeTab === "rentals" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
              <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">My Rentals</h2>
              
              {!isConnected ? (
                <p className="text-center text-slate-500">Connect wallet to see your rentals</p>
              ) : (
                <div className="text-center text-slate-500">
                  <p className="mb-2">No active rentals</p>
                  <p className="text-sm">Your rentals will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-slate-700 py-4 px-8 flex justify-around items-center">
          <button 
            onClick={() => setActiveTab("search")}
            className={activeTab === "search" ? "text-orange-400" : "text-white"}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab("list")}
            className={activeTab === "list" ? "bg-orange-400 rounded-full p-2" : "bg-white rounded-full p-2"}
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button 
            onClick={() => setActiveTab("rentals")}
            className={activeTab === "rentals" ? "text-orange-400" : "text-white"}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </nav>
      </div>
    </main>
  );
}