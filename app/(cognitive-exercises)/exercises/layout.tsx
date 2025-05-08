import { UserProvider } from "@/app/lib/context/UserContext";

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <div className="flex flex-col h-screen">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">AMENTIS</h1>
        </header>
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}