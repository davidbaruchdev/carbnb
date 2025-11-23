import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { CARBNB_ADDRESS, CARBNB_ABI } from "../lib/contract";
import type { Car } from "../lib/supabase";

export function CarCard({ car }: { car: Car }) {
  const { address } = useAccount();
  const [days, setDays] = useState(1);
  
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleRent = () => {
    writeContract({
      address: CARBNB_ADDRESS,
      abi: CARBNB_ABI,
      functionName: "rentCar",
      args: [BigInt(car.id), BigInt(days)],
    });
  };

  const isOwner = address?.toLowerCase() === car.owner.toLowerCase();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
      <img
        src={car.photo_url || "https://via.placeholder.com/400x250?text=No+Photo"}
        alt={car.model}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-700">{car.model}</h3>
        <p className="text-sm text-slate-500">📍 {car.city}</p>
        <p className="text-xl font-bold text-orange-500 mt-2">
          ${car.price_per_day} cUSD/day
        </p>
        
        {car.description && (
          <p className="text-sm text-slate-600 mt-2">{car.description}</p>
        )}

        {isOwner ? (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center text-sm text-blue-700">
            This is your car
          </div>
        ) : (
          <>
            <div className="flex gap-2 items-center mt-4">
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-sm text-slate-600">days</span>
              <button
                onClick={handleRent}
                disabled={isPending || isConfirming}
                className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {isPending ? "Confirm..." : isConfirming ? "Renting..." : "Rent Now"}
              </button>
            </div>

            {isSuccess && (
              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded text-sm text-center">
                ✅ Rented successfully!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}