export default function Header() {
    return (
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-50">
        <div className="max-w-screen-tablet mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ejercicios Cognitivos</h1>
          <nav className="flex gap-4">
            <button className="p-3 bg-blue-700 rounded-lg active:scale-95 transition-transform">
              Perfil
            </button>
          </nav>
        </div>
      </header>
    );
  }