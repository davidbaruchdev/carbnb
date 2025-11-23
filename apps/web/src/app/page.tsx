"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">🚗 CarBnB</h1>
          <p className="text-2xl text-green-300 mb-8">
            Car Between Neighbors
          </p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Alquila autos de locales cuando viajes. 
            Vive cada ciudad como un nativo.
          </p>

          {/* Wallet Connection */}
          <div className="mb-12">
            {isConnected ? (
              <div className="space-y-4">
                <p className="text-green-400">
                  ✅ Conectado: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                <button
                  onClick={() => disconnect()}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
                >
                  Desconectar
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect({ connector: connectors[0] })}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg mb-8"
              >
                🔗 Conectar Wallet
              </button>
            )}
          </div>
          
          <div className="flex gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
              Alquilar un Auto
            </button>
            <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-3 px-8 rounded-lg text-lg">
              Publicar mi Auto
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}