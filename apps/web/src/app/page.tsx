"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CARBNB_ADDRESS, CARBNB_ABI } from "../lib/contract";
import { supabase, type Car } from "../lib/supabase";
import { CarCard } from "../components/CarCard";

type Tab = "search" | "list" | "rentals";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [location, setLocation] = useState("");
  
 
  const [carModel, setCarModel] = useState("");
  const [carCity, setCarCity] = useState("");
  const [carPrice, setCarPrice] = useState("");
  const [carPhoto, setCarPhoto] = useState<File | null>(null);
  const [carDescription, setCarDescription] = useState("");

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    if (location) {
      setFilteredCars(cars.filter(car => 
        car.city.toLowerCase().includes(location.toLowerCase())
      ));
    } else {
      setFilteredCars(cars);
    }
  }, [location, cars]);

  const loadCars = async () => {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setCars(data);
  };

const handleListCar = async () => {
  if (!carModel || !carCity || !carPrice) {
    alert("Please fill all required fields");
    return;
  }

  try {
    // Call smart contract first
    writeContract({
      address: CARBNB_ADDRESS,
      abi: CARBNB_ABI,
      functionName: "listCar",
      args: [carModel, carCity, BigInt(Math.floor(parseFloat(carPrice) * 1e18))],
    });
  } catch (error) {
    console.error("Error listing car:", error);
  }
};

useEffect(() => {
  if (isSuccess && carModel && activeTab === "list") {
    const saveToSupabase = async () => {
      try {
        // Upload photo if exists
        let photoUrl = null;
        if (carPhoto) {
          const fileName = `${Date.now()}-${carPhoto.name}`;
          const { data, error } = await supabase.storage
            .from('car-photos')
            .upload(fileName, carPhoto);
          
          if (data) {
            photoUrl = supabase.storage.from('car-photos').getPublicUrl(fileName).data.publicUrl;
          }
          console.log("Photo uploaded:", photoUrl);
        }

        // Get current car counter from Supabase
        const { data: existingCars } = await supabase.from('cars').select('id').order('id', { ascending: false }).limit(1);
        const newCarId = existingCars && existingCars.length > 0 ? existingCars[0].id + 1 : 0;

        // Save to Supabase
        const { error } = await supabase.from('cars').insert({
          id: newCarId,
          owner: address?.toLowerCase(),
          model: carModel,
          city: carCity,
          price_per_day: parseFloat(carPrice),
          photo_url: photoUrl,
          description: carDescription || null,
        });

        if (error) {
          console.error("Supabase error:", error);
        } else {
          console.log("Car saved to Supabase!");
          // Reset form
          setCarModel("");
          setCarCity("");
          setCarPrice("");
          setCarPhoto(null);
          setCarDescription("");
          
          // Reload cars
          setTimeout(() => loadCars(), 1000);
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
      }
    };

    saveToSupabase();
  }
}, [isSuccess, carModel, activeTab]);

  return (
    <main className="min-h-screen bg-amber-50 relative">
      {/* Wallet Button */}
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
        onClick={() => {
          alert("Click detected! Connectors: " + connectors.length);
          if (connectors.length > 0) {
            connect({ connector: connectors[1] || connectors[0] });
          }
        }}
        className="bg-slate-700 text-white px-6 py-2 rounded-full text-sm hover:bg-slate-800"
      >
        Connect Wallet
      </button>
        )}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex justify-center pt-8 pb-4">
          <img src="/logo.png" alt="CarbNB" className="h-64" />
        </header>

        {/* Content */}
        <div className="flex-1 px-4 pb-20">
          
          {/* SEARCH/BROWSE TAB */}
          {activeTab === "search" && (
            <div className="max-w-sm mx-auto">
              {/* Search box */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                  <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by city..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1 outline-none text-slate-700"
                  />
                </div>
              </div>

              {/* Cars list */}
              {filteredCars.length === 0 ? (
                <div className="text-center text-slate-500 mt-8">
                  <p>No cars available</p>
                  <p className="text-sm mt-2">Be the first to list a car!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCars.map(car => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LIST CAR TAB */}
          {activeTab === "list" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto">
              <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">List Your Car</h2>
              
              {!isConnected ? (
                <p className="text-center text-slate-500">Connect wallet to list your car</p>
              ) : (
                <>
                  {isSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl text-center">
                      ✅ Car listed successfully!
                    </div>
                  )}

                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Car model (e.g. Toyota Corolla)"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={carCity}
                      onChange={(e) => setCarCity(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="number"
                      placeholder="Price per day (cUSD)"
                      value={carPrice}
                      onChange={(e) => setCarPrice(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="mb-4">
                    <textarea
                      placeholder="Description (optional)"
                      value={carDescription}
                      onChange={(e) => setCarDescription(e.target.value)}
                      className="w-full p-4 border border-gray-200 rounded-xl outline-none h-20"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-slate-600 mb-2">Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCarPhoto(e.target.files?.[0] || null)}
                      className="w-full text-sm"
                    />
                  </div>

                  <button 
                    onClick={handleListCar}
                    disabled={isPending || isConfirming}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isPending ? "Confirm in wallet..." : isConfirming ? "Listing..." : "List Car"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* RENTALS TAB */}
          {activeTab === "rentals" && (
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm mx-auto">
              <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">My Rentals</h2>
              
              {!isConnected ? (
                <p className="text-center text-slate-500">Connect wallet to see your rentals</p>
              ) : (
                <div className="text-center text-slate-500">
                  <p>No active rentals</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-700 py-4 px-8 flex justify-around items-center">
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