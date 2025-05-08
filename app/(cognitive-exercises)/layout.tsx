import ExerciseNav  from '../components/exercises/ExerciseNav';

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen">
      <ExerciseNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}