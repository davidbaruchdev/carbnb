export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">🚗 CarbNB</h1>
          <p className="text-2xl text-green-300 mb-8">
            Car Between Neighbors
          </p>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Alquila autos de locales cuando viajes. 
            Vive cada ciudad como un nativo.
          </p>
          
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
  )
}