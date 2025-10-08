export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          WEOKTO & STAM
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Plateforme en construction
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/weokto"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            WEOKTO (Affiliés & Guildes)
          </a>
          <a
            href="/stam"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            STAM (Communautés)
          </a>
        </div>
      </div>
    </main>
  )
}
